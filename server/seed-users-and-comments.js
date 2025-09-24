import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import schemas
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';
import Comment from './Schema/Comment.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCATION);
        console.log('MongoDB connected successfully for seeding');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample user data
const sampleUsers = [
    {
        username: "techguru2024",
        fullname: "Alex Thompson",
        email: "alex.tech@example.com",
        bio: "Full-stack developer passionate about AI and web technologies. Building the future one line of code at a time.",
        profile_img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
        username: "designmaven",
        fullname: "Sarah Chen",
        email: "sarah.design@example.com", 
        bio: "UI/UX designer creating beautiful and intuitive digital experiences. Design thinking enthusiast.",
        profile_img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"
    },
    {
        username: "datascientist_pro",
        fullname: "Michael Rodriguez",
        email: "michael.data@example.com",
        bio: "Data scientist and ML engineer. Turning data into insights and insights into action.",
        profile_img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    {
        username: "cloudarchitect",
        fullname: "Jennifer Liu", 
        email: "jennifer.cloud@example.com",
        bio: "Cloud solutions architect helping businesses scale with AWS, Azure, and GCP. DevOps enthusiast.",
        profile_img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    {
        username: "mobilefirst_dev",
        fullname: "David Kim",
        email: "david.mobile@example.com",
        bio: "Mobile app developer specializing in React Native and Flutter. Building cross-platform experiences.",
        profile_img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    },
    {
        username: "cybersec_expert",
        fullname: "Emma Johnson",
        email: "emma.security@example.com",
        bio: "Cybersecurity expert protecting digital assets. Ethical hacker and security consultant.",
        profile_img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    },
    {
        username: "blockchain_builder",
        fullname: "Robert Anderson",
        email: "robert.blockchain@example.com",
        bio: "Blockchain developer building decentralized applications. Web3 and smart contract specialist.",
        profile_img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400"
    },
    {
        username: "airesearcher",
        fullname: "Lisa Park",
        email: "lisa.ai@example.com", 
        bio: "AI researcher exploring the frontiers of machine learning and neural networks. PhD in Computer Science.",
        profile_img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    },
    {
        username: "devops_ninja",
        fullname: "James Wilson",
        email: "james.devops@example.com",
        bio: "DevOps engineer automating everything. CI/CD, Infrastructure as Code, and cloud-native solutions.",
        profile_img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400"
    },
    {
        username: "fullstack_wizard",
        fullname: "Maria Garcia",
        email: "maria.fullstack@example.com",
        bio: "Full-stack wizard crafting end-to-end solutions. MERN stack specialist with a passion for clean code.",
        profile_img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400"
    }
];

// Sample blog posts with EditorJS format
const sampleBlogPosts = [
    {
        title: "The Future of AI in Web Development: Trends for 2025",
        banner: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        des: "Exploring how artificial intelligence is revolutionizing web development practices and what developers need to know for the future.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "sheNwCUP5A",
                        "type": "header", 
                        "data": {
                            "text": "AI-Powered Development Tools Are Changing Everything",
                            "level": 2
                        }
                    },
                    {
                        "id": "12iM3lqzcm",
                        "type": "paragraph",
                        "data": {
                            "text": "The landscape of web development is undergoing a massive transformation with the integration of artificial intelligence. From code generation to automated testing, AI tools are becoming indispensable for modern developers."
                        }
                    },
                    {
                        "id": "fvZGuFXHmI",
                        "type": "paragraph", 
                        "data": {
                            "text": "GitHub Copilot, ChatGPT, and other AI assistants are not just helping with code completion—they're revolutionizing how we approach problem-solving in development. These tools can generate entire functions, suggest optimizations, and even help with debugging complex issues."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["AI", "Web Development", "Technology", "Future"]
    },
    {
        title: "Design Systems That Scale: Building Consistent UI at Enterprise Level",
        banner: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        des: "A comprehensive guide to creating and maintaining design systems that grow with your organization.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "design123", 
                        "type": "header",
                        "data": {
                            "text": "Why Design Systems Matter More Than Ever",
                            "level": 2
                        }
                    },
                    {
                        "id": "design456",
                        "type": "paragraph",
                        "data": {
                            "text": "In today's fast-paced digital environment, maintaining consistency across multiple products and platforms is crucial. Design systems provide the foundation for scalable, maintainable user interfaces that enhance both developer productivity and user experience."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["Design Systems", "UI/UX", "Enterprise", "Scalability"]
    },
    {
        title: "Machine Learning in Production: Lessons from Real-World Deployments", 
        banner: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
        des: "Hard-learned lessons from deploying ML models in production environments and how to avoid common pitfalls.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "ml123",
                        "type": "header",
                        "data": {
                            "text": "The Reality Gap: Lab vs Production",
                            "level": 2
                        }
                    },
                    {
                        "id": "ml456",
                        "type": "paragraph", 
                        "data": {
                            "text": "Moving machine learning models from development to production is often more challenging than anticipated. Data drift, model degradation, and infrastructure scaling issues are just a few of the obstacles teams face."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["Machine Learning", "Production", "MLOps", "Data Science"]
    },
    {
        title: "Cloud-Native Architecture: Building Resilient Applications for the Modern Era",
        banner: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800", 
        des: "Exploring cloud-native principles and how they enable businesses to build scalable, resilient applications.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "cloud123",
                        "type": "header",
                        "data": {
                            "text": "Microservices and Container Orchestration",
                            "level": 2
                        }
                    },
                    {
                        "id": "cloud456",
                        "type": "paragraph",
                        "data": {
                            "text": "Cloud-native architecture represents a fundamental shift in how we design and deploy applications. By leveraging microservices, containers, and orchestration platforms like Kubernetes, organizations can achieve unprecedented levels of scalability and resilience."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["Cloud Architecture", "Microservices", "Kubernetes", "DevOps"]
    },
    {
        title: "React Native vs Flutter: The Ultimate Mobile Development Showdown",
        banner: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
        des: "An in-depth comparison of the two leading cross-platform mobile development frameworks.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "mobile123",
                        "type": "header",
                        "data": {
                            "text": "Performance, Developer Experience, and Ecosystem",
                            "level": 2
                        }
                    },
                    {
                        "id": "mobile456", 
                        "type": "paragraph",
                        "data": {
                            "text": "Choosing between React Native and Flutter depends on various factors including team expertise, performance requirements, and long-term maintenance considerations. Both frameworks have their strengths and trade-offs."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["React Native", "Flutter", "Mobile Development", "Cross Platform"]
    },
    {
        title: "Zero Trust Security: Protecting Your Applications in a Borderless World",
        banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
        des: "Understanding Zero Trust security principles and how to implement them in modern applications.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "security123",
                        "type": "header", 
                        "data": {
                            "text": "Never Trust, Always Verify",
                            "level": 2
                        }
                    },
                    {
                        "id": "security456",
                        "type": "paragraph",
                        "data": {
                            "text": "The traditional network perimeter is dissolving. Zero Trust security assumes that threats exist both inside and outside the network, requiring verification for every access request regardless of location or user credentials."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["Cybersecurity", "Zero Trust", "Network Security", "Authentication"]
    },
    {
        title: "DeFi Revolution: Building Decentralized Financial Applications",
        banner: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
        des: "A deep dive into decentralized finance protocols and how to build secure DeFi applications.",
        content: [
            {
                "time": 1635603431943, 
                "blocks": [
                    {
                        "id": "defi123",
                        "type": "header",
                        "data": {
                            "text": "Smart Contracts and Yield Farming",
                            "level": 2
                        }
                    },
                    {
                        "id": "defi456",
                        "type": "paragraph",
                        "data": {
                            "text": "Decentralized Finance is reshaping the financial landscape by removing intermediaries and enabling programmable money. Smart contracts on Ethereum and other blockchains power lending, borrowing, and trading protocols."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["DeFi", "Blockchain", "Smart Contracts", "Ethereum"]
    },
    {
        title: "Transformer Models and the Evolution of Natural Language Processing",
        banner: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800",
        des: "Exploring how transformer architecture revolutionized NLP and what's coming next in language models.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "nlp123",
                        "type": "header",
                        "data": {
                            "text": "From Attention Mechanisms to GPT",
                            "level": 2  
                        }
                    },
                    {
                        "id": "nlp456",
                        "type": "paragraph",
                        "data": {
                            "text": "The transformer architecture introduced the concept of attention mechanisms that revolutionized how machines understand language. From BERT to GPT-4, these models have achieved human-like performance on numerous language tasks."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["NLP", "Transformers", "AI", "Language Models"]
    },
    {
        title: "Infrastructure as Code: Automating Your Deployment Pipeline",
        banner: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800",
        des: "Best practices for implementing Infrastructure as Code using Terraform, CloudFormation, and modern DevOps tools.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "iac123", 
                        "type": "header",
                        "data": {
                            "text": "Terraform vs CloudFormation vs Pulumi",
                            "level": 2
                        }
                    },
                    {
                        "id": "iac456",
                        "type": "paragraph",
                        "data": {
                            "text": "Infrastructure as Code enables teams to manage and provision infrastructure through machine-readable definition files. This approach ensures consistency, reduces manual errors, and enables version control for infrastructure changes."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["Infrastructure", "DevOps", "Terraform", "Automation"]
    },
    {
        title: "Modern JavaScript Frameworks: Choosing Between React, Vue, and Svelte",
        banner: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
        des: "A comprehensive comparison of modern JavaScript frameworks and when to use each one.",
        content: [
            {
                "time": 1635603431943,
                "blocks": [
                    {
                        "id": "js123",
                        "type": "header",
                        "data": {
                            "text": "Performance, Bundle Size, and Developer Experience",
                            "level": 2
                        }
                    },
                    {
                        "id": "js456",
                        "type": "paragraph",
                        "data": {
                            "text": "The JavaScript ecosystem offers numerous framework options, each with unique strengths. React's ecosystem maturity, Vue's approachability, and Svelte's compile-time optimizations cater to different project needs and team preferences."
                        }
                    }
                ],
                "version": "2.27.2"
            }
        ],
        tags: ["JavaScript", "React", "Vue", "Svelte", "Frontend"]
    }
];

// Sample comments for cross-user interaction
const sampleComments = [
    "This is exactly what I needed to understand! Great explanation of the concepts.",
    "Love how you broke down the complex topics into digestible parts. Very helpful!",
    "Fantastic insights! I've been struggling with this exact problem at work.",
    "Your approach to this is really innovative. Thanks for sharing your experience!",
    "This article changed my perspective on the topic. Well written and researched!",
    "Perfect timing for this post! I was just exploring these technologies.",
    "The practical examples really helped me understand the implementation details.",
    "As someone new to this field, this explanation was incredibly clear and helpful.",
    "Great post! I've bookmarked this for future reference. Keep up the excellent work!",
    "Your real-world examples make all the difference. Thanks for sharing your knowledge!",
    "This is gold! I wish I had found this article earlier in my learning journey.",
    "Excellent breakdown of the pros and cons. This will help me make better decisions.",
    "The code examples are spot-on. This is going to save me so much time!",
    "Thanks for demystifying this topic. Your explanations are always so clear!",
    "This post deserves more visibility. Sharing it with my team right away!"
];

// Generate password hash
const generatePasswordHash = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Create users
const createUsers = async () => {
    console.log('Creating users...');
    const users = [];
    
    for (let i = 0; i < sampleUsers.length; i++) {
        const userData = sampleUsers[i];
        const passwordHash = await generatePasswordHash('testpassword123');
        
        const user = new User({
            personal_info: {
                fullname: userData.fullname,
                email: userData.email,
                password: passwordHash,
                username: userData.username,
                bio: userData.bio,
                profile_img: userData.profile_img
            },
            social_links: {},
            account_info: {
                total_posts: 0,
                total_reads: 0
            },
            google_auth: false,
            blogs: []
        });
        
        const savedUser = await user.save();
        users.push(savedUser);
        console.log(`Created user: ${userData.username}`);
    }
    
    return users;
};

// Create blog posts
const createBlogs = async (users) => {
    console.log('Creating blog posts...');
    const blogs = [];
    
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const postData = sampleBlogPosts[i];
        
        const blog = new Blog({
            blog_id: nanoid(),
            title: postData.title,
            des: postData.des,
            banner: postData.banner,
            content: postData.content,
            tags: postData.tags,
            author: user._id,
            activity: {
                total_likes: Math.floor(Math.random() * 50) + 10,
                total_comments: 0,
                total_reads: Math.floor(Math.random() * 200) + 50,
                total_parent_comments: 0
            },
            comments: [],
            draft: false
        });
        
        const savedBlog = await blog.save();
        
        // Update user's blog count and blog list
        await User.findByIdAndUpdate(user._id, {
            $push: { blogs: savedBlog._id },
            $inc: { "account_info.total_posts": 1 }
        });
        
        blogs.push(savedBlog);
        console.log(`Created blog: ${postData.title}`);
    }
    
    return blogs;
};

// Create comments (users commenting on each other's posts)
const createComments = async (users, blogs) => {
    console.log('Creating comments...');
    const comments = [];
    
    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        const numComments = Math.floor(Math.random() * 5) + 3; // 3-7 comments per blog
        
        for (let j = 0; j < numComments; j++) {
            // Select a random user to comment (not the blog author)
            let commenterIndex;
            do {
                commenterIndex = Math.floor(Math.random() * users.length);
            } while (users[commenterIndex]._id.toString() === blog.author.toString());
            
            const commenter = users[commenterIndex];
            const commentText = sampleComments[Math.floor(Math.random() * sampleComments.length)];
            
            const comment = new Comment({
                blog_id: blog._id,
                blog_author: blog.author,
                comment: commentText,
                commented_by: commenter._id,
                children: [],
                isReply: false
            });
            
            const savedComment = await comment.save();
            
            // Update blog's comment count and comment list
            await Blog.findByIdAndUpdate(blog._id, {
                $push: { comments: savedComment._id },
                $inc: {
                    "activity.total_comments": 1,
                    "activity.total_parent_comments": 1
                }
            });
            
            comments.push(savedComment);
        }
        
        console.log(`Created ${numComments} comments for blog: ${blog.title}`);
    }
    
    return comments;
};

// Create some replies to existing comments
const createReplies = async (users, comments) => {
    console.log('Creating comment replies...');
    
    // Create replies for about 30% of comments
    const commentsToReply = comments.slice(0, Math.floor(comments.length * 0.3));
    
    for (const parentComment of commentsToReply) {
        const numReplies = Math.floor(Math.random() * 3) + 1; // 1-3 replies
        
        for (let i = 0; i < numReplies; i++) {
            // Select a random user to reply (not the original commenter)
            let replierIndex;
            do {
                replierIndex = Math.floor(Math.random() * users.length);
            } while (users[replierIndex]._id.toString() === parentComment.commented_by.toString());
            
            const replier = users[replierIndex];
            const replyText = "Thanks for your comment! " + sampleComments[Math.floor(Math.random() * sampleComments.length)];
            
            const reply = new Comment({
                blog_id: parentComment.blog_id,
                blog_author: parentComment.blog_author, 
                comment: replyText,
                commented_by: replier._id,
                parent: parentComment._id,
                children: [],
                isReply: true
            });
            
            const savedReply = await reply.save();
            
            // Update parent comment's children
            await Comment.findByIdAndUpdate(parentComment._id, {
                $push: { children: savedReply._id }
            });
            
            // Update blog's total comment count (but not parent comment count)
            await Blog.findByIdAndUpdate(parentComment.blog_id, {
                $push: { comments: savedReply._id },
                $inc: { "activity.total_comments": 1 }
            });
        }
        
        console.log(`Created ${numReplies} replies for comment`);
    }
};

// Main seeding function
const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Blog.deleteMany({});
        await Comment.deleteMany({});
        
        // Create new data
        const users = await createUsers();
        const blogs = await createBlogs(users);
        const comments = await createComments(users, blogs);
        await createReplies(users, comments);
        
        console.log('\n=== SEEDING COMPLETED ===');
        console.log(`Created ${users.length} users`);
        console.log(`Created ${blogs.length} blog posts`);
        console.log(`Created ${comments.length} comments`);
        console.log('\n=== TEST ACCOUNTS ===');
        console.log('All users have the password: testpassword123');
        console.log('\nSample login credentials:');
        users.slice(0, 3).forEach(user => {
            console.log(`Email: ${user.personal_info.email} | Username: ${user.personal_info.username}`);
        });
        
        console.log('\n=== TESTING INSTRUCTIONS ===');
        console.log('1. Login with any of the test accounts');
        console.log('2. Browse the blog posts to see comments');
        console.log('3. Try adding new comments to test the system');
        console.log('4. Check if comment counts match actual comments displayed');
        
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);
    }
};

// Run the seeding
seedDatabase();