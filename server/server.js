import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import User from './Schema/User.js'; // schema below
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

server.listen(PORT, () => {
    console.log(`Server is running -> ${PORT}`);
})