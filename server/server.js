import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';
import Comment from './Schema/Comment.js';
import Notification from './Schema/Notification.js';
import admin from "firebase-admin"
import serviceAccountKey from './inkwell-5ae8a-firebase-adminsdk-fbsvc-c3efe159cb.json';
import { getAuth } from 'firebase-admin/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';

// Setting up Cloudflare R2 client (S3-compatible)
const r2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});
// Optionally expose on app locals or export the client
// const R2_BUCKET = process.env.R2_BUCKET; // e.g., "inkwell"


const server = express();
const PORT = 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
})

const formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    }
}

const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username
}

// Removed the upload image url route and the associated function to avoid CORS issues

server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;
    // validating the data from frontend
    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be at least 3 letters long" });
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Email is required" });
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is invalid" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password must be between 6 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter" });
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {

        let username = await generateUsername(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        })

        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u));
        })
            .catch(err => {
                if (err.code == 11000) {
                    return res.status(500).json({ "error": "Email already exists" });
                }
                return res.status(500).json({ "error": err.message });
            });
    });

});

server.post("/signin", (req, res) => {
    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email }).then((user) => {
        if (!user) {
            return res.status(403).json({ "error": "Email not found" });
        }

        if (!user.google_auth) {

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ "error": "Error occured while login please try again" });
                }
                if (!result) {
                    return res.status(403).json({ "error": "Password is incorrect" });
                } else {
                    return res.status(200).json(formatDatatoSend(user));
                }
            });
        }
        else {
            return res.status(403).json({ "error": "This email was signed up with Google. Please log in with Google to access the account" });
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ "error": err.message });
        });

});

server.post('/google-auth', async (req, res) => {
    let { access_token } = req.body;
    getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {
            let { email, name, picture } = decodedUser;

            picture = picture.replace("s96-c", "s384-c");

            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
                return u || null
            })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ "error": err.message });
                });
            if (user) {  //login
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "This email was signed up without google. Please log in with password to access the account" });
                }
            }
            else { //signup
                let username = await generateUsername(email);
                user = new User({
                    personal_info: { fullname: name, email, profile_img: picture, username },
                    google_auth: true
                });
                await user.save().then((u) => {
                    user = u;
                })
                    .catch(err => {
                        return res.status(500).json({ "error": err.message });
                    });
            }
            return res.status(200).json(formatDatatoSend(user));
        })
        .catch(err => {
            return res.status(500).json({ "error": "Failed to authenticate you with Google. Try with some other google account" });
        });
})

// configured multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 500 * 1024, // 500KB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Server side upload endpoint
server.post("/upload-image", (req, res) => {
    upload.single('image')(req, res, async (err) => {
        // Handle multer errors
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    error: "Image size is too large. Please choose an image smaller than 500KB." 
                });
            }
            if (err.message === 'Only image files are allowed!') {
                return res.status(400).json({ 
                    error: "Only image files are allowed. Please select a valid image file." 
                });
            }
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        try {
            const imageName = `${nanoid()}-${Date.now()}.jpeg`;

            const command = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET || 'inkwell',
                Key: imageName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            });

            await r2.send(command);

            const imageUrl = `https://pub-8de2e5d321ea47209d8f85e585442c02.r2.dev/${imageName}`;
            
            return res.status(200).json({ 
                imageUrl: imageUrl
            });

        } catch (err) {
            return res.status(500).json({ error: "Failed to upload image. Please try again." });
        }
    });
});

// Middleware to verify JWT token
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Blog Creation API
server.post("/create-blog", verifyJWT, (req, res) => {
    let { title, banner, content, tags, des, draft } = req.body;

    if (!title.length) {
        return res.status(403).json({ error: "You must provide a title to publish the blog" });
    }

    if (!draft) {
        if (!des.length || des.length > 200) {
            return res.status(403).json({ error: "You must provide blog description under 200 characters" });
        }
        if (!banner.length) {
            return res.status(403).json({ error: "You must provide a banner to publish the blog" });
        }
        if (!content.blocks.length) {
            return res.status(403).json({ error: "There must be some content to publish the blog" });
        }
        if (!tags.length || tags.length > 10) {
            return res.status(403).json({ error: "Provide tags for your blog. Maximum 10" });
        }
    }

    let blog_id = nanoid();

    let blog = new Blog({
        title,
        des,
        banner,
        content,
        tags,
        author: req.user,
        blog_id,
        draft: Boolean(draft)
    });

    blog.save().then(async (blog) => {
        let incrementVal = draft ? 0 : 1;

        await User.findOneAndUpdate(
            { _id: req.user },
            {
                $inc: { "account_info.total_posts": incrementVal },
                $push: { "blogs": blog._id }
            }
        );

        return res.status(200).json({ blog_id });
    }).catch(err => {
        return res.status(500).json({ error: err.message });
    });
});

// Get Latest Blogs API
server.get("/latest-blogs", (req, res) => {
    let { page = 1 } = req.query;
    let maxLimit = 5;

    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity publishedAt tags")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {
            return res.status(200).json({ blogs });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Get Trending Blogs API
server.get("/trending-blogs", (req, res) => {
    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "activity.total_reads": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id")
        .limit(5)
        .then(blogs => {
            return res.status(200).json({ blogs });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Get Individual Blog API
server.get("/get-blog/:blog_id", (req, res) => {
    let { blog_id } = req.params;

    Blog.findOne({ blog_id })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname personal_info.bio -_id")
        .populate("comments.commented_by", "personal_info.username personal_info.profile_img -_id")
        .populate("comments.children")
        .select("title des content banner author publishedAt activity tags")
        .then(async (blog) => {
            await Blog.findOneAndUpdate({ blog_id }, { $inc: { "activity.total_reads": 1 } })
                .then(async () => {
                    await User.findOneAndUpdate(
                        { _id: blog.author._id },
                        { $inc: { "account_info.total_reads": 1 } }
                    );
                });

            return res.status(200).json({ blog });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Search Blogs API
server.get("/search-blogs", (req, res) => {
    let { tag, query, author, page = 1 } = req.query;
    let findQuery = { draft: false };
    let maxLimit = 5;

    if (tag) {
        findQuery.tags = { $in: [tag] };
    }

    if (query) {
        findQuery.title = { $regex: query, $options: "i" };
    }

    if (author) {
        findQuery.author = author;
    }

    Blog.find(findQuery)
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity publishedAt tags")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {
            return res.status(200).json({ blogs });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Search Users API
server.get("/search-users", (req, res) => {
    let { query } = req.query;

    User.find({ "personal_info.username": { $regex: query, $options: "i" } })
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .then(users => {
            return res.status(200).json({ users });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Like Blog API
server.post("/like-blog", verifyJWT, (req, res) => {
    let user_id = req.user;
    let { _id, isLikedByUser } = req.body;

    let updateVal = isLikedByUser ? -1 : 1;

    Blog.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": updateVal } })
        .then(() => {
            return res.status(200).json({ total_likes: updateVal });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Check if Blog is Liked by User
server.get("/is-liked-by-user", verifyJWT, (req, res) => {
    let user_id = req.user;
    let { _id } = req.query;

    // This is a simplified version - in a real app you'd track likes in a separate collection
    return res.status(200).json({ result: false });
});

// Add Comment API
server.post("/add-comment", verifyJWT, (req, res) => {
    let { _id, comment, blog_author, replying_to } = req.body;

    if (!comment.length) {
        return res.status(403).json({ error: "Write something to leave a comment" });
    }

    let commentObj = {
        blog_id: _id,
        blog_author,
        comment,
        commented_by: req.user
    };

    if (replying_to) {
        commentObj.parent = replying_to;
        commentObj.isReply = true;
    }

    new Comment(commentObj).save().then(async (commentDoc) => {
        let { comment, _id, commented_by, commentedAt, children } = commentDoc;

        Blog.findOneAndUpdate(
            { _id },
            {
                $push: { comments: _id },
                $inc: {
                    "activity.total_comments": 1,
                    "activity.total_parent_comments": replying_to ? 0 : 1
                }
            }
        ).then(() => {
            return res.status(200).json({ comment });
        });
    });
});

// Get Blog Comments API
server.get("/get-blog-comments", (req, res) => {
    let { blog_id, skip = 0 } = req.query;

    Comment.find({ blog_id, isReply: false })
        .populate("commented_by", "personal_info.username personal_info.profile_img -_id")
        .populate("children")
        .sort({ "commentedAt": -1 })
        .skip(skip)
        .limit(2)
        .then(comments => {
            return res.status(200).json({ comments });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Get Comment Replies API
server.get("/get-replies", (req, res) => {
    let { _id, skip = 0 } = req.query;

    Comment.findOne({ _id })
        .populate({
            path: "children",
            populate: {
                path: "commented_by",
                select: "personal_info.username personal_info.profile_img -_id"
            },
            options: {
                skip: skip,
                limit: 5,
                sort: { "commentedAt": -1 }
            }
        })
        .select("children")
        .then(comment => {
            return res.status(200).json({ replies: comment.children });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Delete Comment API
server.delete("/delete-comment", verifyJWT, (req, res) => {
    let user_id = req.user;
    let { _id } = req.body;

    Comment.findOneAndDelete({ _id, commented_by: user_id })
        .then(comment => {
            if (comment) {
                Blog.findOneAndUpdate(
                    { _id: comment.blog_id },
                    {
                        $pull: { comments: _id },
                        $inc: {
                            "activity.total_comments": -1,
                            "activity.total_parent_comments": comment.parent ? 0 : -1
                        }
                    }
                ).then(() => {
                    return res.status(200).json({ status: "Done" });
                });
            } else {
                return res.status(403).json({ error: "You can only delete your own comments" });
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Get Notifications API
server.get("/notifications", verifyJWT, (req, res) => {
    let { page = 1, type, deletedDocCount = 0 } = req.query;
    let maxLimit = 10;
    let findQuery = { notification_for: req.user };

    if (type !== "all") {
        findQuery.type = type;
    }

    Notification.find(findQuery)
        .skip((page - 1) * maxLimit + deletedDocCount)
        .limit(maxLimit)
        .populate("blog", "title blog_id")
        .populate("user", "personal_info.fullname personal_info.profile_img")
        .populate("comment", "comment")
        .populate("reply", "comment")
        .populate("replied_on_comment", "comment")
        .sort({ "createdAt": -1 })
        .then(notifications => {
            return res.status(200).json({ notifications });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Change Password API
server.post("/change-password", verifyJWT, (req, res) => {
    let { currentPassword, newPassword } = req.body;

    if (!passwordRegex.test(newPassword)) {
        return res.status(403).json({ error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
    }

    User.findById(req.user)
        .then(user => {
            bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Error occurred while changing the password" });
                }
                if (!result) {
                    return res.status(403).json({ error: "Current password is incorrect" });
                }

                bcrypt.hash(newPassword, 10, (err, hashed_password) => {
                    User.findByIdAndUpdate(req.user, { "personal_info.password": hashed_password })
                        .then(() => {
                            return res.status(200).json({ status: "Password changed" });
                        })
                        .catch(err => {
                            return res.status(500).json({ error: "Error occurred while changing the password" });
                        });
                });
            });
        })
        .catch(err => {
            return res.status(500).json({ error: "User not found" });
        });
});

// Update Profile API
server.post("/update-profile", verifyJWT, (req, res) => {
    let { username, bio, social_links } = req.body;

    let bioLimit = 200;

    if (username.length < 3) {
        return res.status(403).json({ error: "Username should be at least 3 letters long" });
    }
    if (bio.length > bioLimit) {
        return res.status(403).json({ error: `Bio should not be more than ${bioLimit} characters` });
    }

    let socialLinksArr = Object.keys(social_links);

    User.findOneAndUpdate(
        { _id: req.user },
        {
            "personal_info.username": username,
            "personal_info.bio": bio,
            social_links
        }
    ).then(() => {
        return res.status(200).json({ username });
    }).catch(err => {
        if (err.code == 11000) {
            return res.status(500).json({ error: "Username is already taken" });
        }
        return res.status(500).json({ error: err.message });
    });
});

// Get User API
server.get("/get-user/:user_id", (req, res) => {
    let { user_id } = req.params;

    User.findById(user_id)
        .select("personal_info.fullname personal_info.username personal_info.profile_img personal_info.bio account_info.total_posts account_info.total_reads -_id")
        .then(user => {
            if (user) {
                return res.status(200).json({ user });
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Get Current User API
server.get("/get-user", verifyJWT, (req, res) => {
    User.findById(req.user)
        .select("personal_info.fullname personal_info.username personal_info.profile_img personal_info.bio account_info.total_posts account_info.total_reads social_links -_id")
        .then(user => {
            if (user) {
                return res.status(200).json({ user });
            } else {
                return res.status(404).json({ error: "User not found" });
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Get User Blogs API
server.get("/get-user-blogs", verifyJWT, (req, res) => {
    Blog.find({ author: req.user })
        .select("title des banner activity publishedAt draft blog_id")
        .sort({ "publishedAt": -1 })
        .then(blogs => {
            return res.status(200).json({ blogs });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Delete Blog API
server.delete("/delete-blog", verifyJWT, (req, res) => {
    let { blogId } = req.body;

    Blog.findOneAndDelete({ _id: blogId, author: req.user })
        .then(blog => {
            if (blog) {
                User.findOneAndUpdate(
                    { _id: req.user },
                    {
                        $pull: { "blogs": blogId },
                        $inc: { "account_info.total_posts": -1 }
                    }
                ).then(() => {
                    return res.status(200).json({ status: "Blog deleted" });
                });
            } else {
                return res.status(403).json({ error: "Blog not found or you don't have permission to delete it" });
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

// Mark Notification as Read API
server.post("/mark-notification", verifyJWT, (req, res) => {
    let { notificationId } = req.body;

    Notification.findOneAndUpdate(
        { _id: notificationId, notification_for: req.user },
        { seen: true }
    )
    .then(() => {
        return res.status(200).json({ status: "Notification marked as read" });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running -> ${PORT}`);
})