import mongoose from 'mongoose';
import 'dotenv/config';
import { nanoid } from 'nanoid';
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';

// Connect to MongoDB
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

const samplePosts = [
    {
        title: "Getting Started with React Hooks: A Complete Guide",
        des: "Learn how to use React Hooks to write cleaner, more functional components. This comprehensive guide covers useState, useEffect, and custom hooks.",
        content: {
            time: Date.now(),
            blocks: [
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "What are React Hooks?",
                        level: 2
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React applications."
                    }
                },
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "useState Hook",
                        level: 3
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "The useState hook allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it."
                    }
                },
                {
                    id: nanoid(),
                    type: "code",
                    data: {
                        code: "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}"
                    }
                }
            ],
            version: "2.27.2"
        },
        tags: ["react", "javascript", "hooks", "frontend", "web-development"],
        banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
    },
    {
        title: "Building RESTful APIs with Node.js and Express",
        des: "Step-by-step tutorial on creating robust REST APIs using Node.js and Express framework. Learn about middleware, routing, and best practices.",
        content: {
            time: Date.now(),
            blocks: [
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Introduction to REST APIs",
                        level: 2
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol."
                    }
                },
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Setting up Express Server",
                        level: 3
                    }
                },
                {
                    id: nanoid(),
                    type: "code",
                    data: {
                        code: "import express from 'express';\nimport cors from 'cors';\n\nconst app = express();\nconst PORT = 3000;\n\napp.use(express.json());\napp.use(cors());\n\napp.get('/api/users', (req, res) => {\n  res.json({ message: 'Welcome to our API!' });\n});\n\napp.listen(PORT, () => {\n  console.log(`Server running on port ${PORT}`);\n});"
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "This basic setup creates an Express server with CORS enabled and JSON parsing middleware. The server listens on port 3000 and provides a simple GET endpoint."
                    }
                }
            ],
            version: "2.27.2"
        },
        tags: ["nodejs", "express", "api", "backend", "javascript"],
        banner: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop"
    },
    {
        title: "MongoDB Database Design Best Practices",
        des: "Learn how to design efficient MongoDB databases with proper schema design, indexing strategies, and performance optimization techniques.",
        content: {
            time: Date.now(),
            blocks: [
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Understanding Document-Based Design",
                        level: 2
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "Unlike relational databases, MongoDB stores data in flexible, JSON-like documents. This allows for more natural data representation but requires different design considerations."
                    }
                },
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Schema Design Principles",
                        level: 3
                    }
                },
                {
                    id: nanoid(),
                    type: "list",
                    data: {
                        style: "unordered",
                        items: [
                            "Embed frequently accessed data together",
                            "Normalize when data is updated frequently",
                            "Consider query patterns when designing schemas",
                            "Use references for many-to-many relationships"
                        ]
                    }
                },
                {
                    id: nanoid(),
                    type: "quote",
                    data: {
                        text: "Design your schema to match your application's query patterns, not the other way around.",
                        caption: "MongoDB Design Philosophy"
                    }
                }
            ],
            version: "2.27.2"
        },
        tags: ["mongodb", "database", "nosql", "backend", "performance"],
        banner: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop"
    },
    {
        title: "Modern CSS Grid Layout: From Basics to Advanced",
        des: "Master CSS Grid layout with practical examples. Learn how to create responsive, flexible layouts that work across all devices and browsers.",
        content: {
            time: Date.now(),
            blocks: [
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Introduction to CSS Grid",
                        level: 2
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "CSS Grid Layout is a two-dimensional layout system for the web. It lets you layout items in rows and columns, making it perfect for creating complex responsive layouts."
                    }
                },
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Basic Grid Setup",
                        level: 3
                    }
                },
                {
                    id: nanoid(),
                    type: "code",
                    data: {
                        code: ".grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto;\n  gap: 20px;\n  padding: 20px;\n}\n\n.grid-item {\n  background: #f0f0f0;\n  padding: 20px;\n  text-align: center;\n}"
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "This creates a simple 3-column grid with equal-width columns and a 20px gap between items. The 'fr' unit represents a fraction of the available space."
                    }
                }
            ],
            version: "2.27.2"
        },
        tags: ["css", "grid", "layout", "responsive", "frontend"],
        banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop"
    },
    {
        title: "JavaScript ES6+ Features Every Developer Should Know",
        des: "Explore the most important JavaScript ES6+ features including arrow functions, destructuring, async/await, and modules that will make your code cleaner and more efficient.",
        content: {
            time: Date.now(),
            blocks: [
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Arrow Functions",
                        level: 2
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "Arrow functions provide a more concise way to write functions and have different behavior with the 'this' keyword compared to regular functions."
                    }
                },
                {
                    id: nanoid(),
                    type: "code",
                    data: {
                        code: "// Traditional function\nfunction add(a, b) {\n  return a + b;\n}\n\n// Arrow function\nconst add = (a, b) => a + b;\n\n// Array methods with arrow functions\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);"
                    }
                },
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Destructuring Assignment",
                        level: 2
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "Destructuring allows you to extract values from arrays or properties from objects into distinct variables."
                    }
                },
                {
                    id: nanoid(),
                    type: "code",
                    data: {
                        code: "// Object destructuring\nconst user = { name: 'John', age: 30, city: 'New York' };\nconst { name, age } = user;\n\n// Array destructuring\nconst colors = ['red', 'green', 'blue'];\nconst [primary, secondary] = colors;\n\n// Function parameter destructuring\nfunction greet({ name, age }) {\n  console.log(`Hello ${name}, you are ${age} years old`);\n}"
                    }
                }
            ],
            version: "2.27.2"
        },
        tags: ["javascript", "es6", "programming", "frontend", "modern-js"],
        banner: "https://images.unsplash.com/photo-1579820010410-c10411aaaa88?w=800&h=400&fit=crop"
    },
    {
        title: "Deployment Strategies for Full-Stack Applications",
        des: "Complete guide to deploying MERN stack applications using modern platforms like Vercel, Netlify, and Railway. Learn about environment variables, CI/CD, and monitoring.",
        content: {
            time: Date.now(),
            blocks: [
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Choosing the Right Deployment Platform",
                        level: 2
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "Modern deployment platforms have made it easier than ever to deploy full-stack applications. Each platform has its strengths and is suitable for different use cases."
                    }
                },
                {
                    id: nanoid(),
                    type: "list",
                    data: {
                        style: "unordered",
                        items: [
                            "Vercel: Perfect for Next.js and frontend applications",
                            "Netlify: Great for static sites and JAMstack apps",
                            "Railway: Excellent for backend services and databases",
                            "Render: Good alternative to Heroku for full-stack apps"
                        ]
                    }
                },
                {
                    id: nanoid(),
                    type: "header",
                    data: {
                        text: "Environment Variables Best Practices",
                        level: 3
                    }
                },
                {
                    id: nanoid(),
                    type: "paragraph",
                    data: {
                        text: "Never commit sensitive information like API keys, database URLs, or secrets to version control. Use environment variables for all configuration."
                    }
                },
                {
                    id: nanoid(),
                    type: "code",
                    data: {
                        code: "// .env file (never commit this!)\nDB_URL=mongodb+srv://user:password@cluster.mongodb.net/myapp\nJWT_SECRET=your-super-secret-key\nAPI_KEY=your-api-key\n\n// In your application\nconst dbUrl = process.env.DB_URL;\nconst jwtSecret = process.env.JWT_SECRET;"
                    }
                }
            ],
            version: "2.27.2"
        },
        tags: ["deployment", "devops", "mern", "vercel", "netlify"],
        banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"
    }
];

async function seedPosts() {
    try {
        console.log('🌱 Starting to seed blog posts...');
        
        // Check if we have any users, if not create a default one
        let author = await User.findOne();
        
        if (!author) {
            console.log('📝 Creating default author...');
            author = new User({
                personal_info: {
                    fullname: "Tech Writer",
                    email: "writer@inkwell.com",
                    username: "techwriter",
                    bio: "Passionate about sharing knowledge through clear, practical tutorials and guides.",
                    profile_img: "https://api.dicebear.com/6.x/avataaars/svg?seed=techwriter"
                },
                account_info: {
                    total_posts: 0,
                    total_reads: 0
                }
            });
            await author.save();
            console.log('✅ Default author created');
        }

        // Clear existing blogs (optional - remove this if you want to keep existing posts)
        await Blog.deleteMany({});
        console.log('🧹 Cleared existing blog posts');

        // Create new blog posts
        for (const postData of samplePosts) {
            const blog = new Blog({
                blog_id: nanoid(),
                title: postData.title,
                des: postData.des,
                banner: postData.banner,
                content: postData.content,
                tags: postData.tags,
                author: author._id,
                activity: {
                    total_likes: Math.floor(Math.random() * 50) + 5, // Random likes between 5-55
                    total_comments: Math.floor(Math.random() * 20) + 1, // Random comments 1-21
                    total_reads: Math.floor(Math.random() * 500) + 100, // Random reads 100-600
                    total_parent_comments: Math.floor(Math.random() * 15) + 1
                },
                draft: false
            });

            await blog.save();
            console.log(`✅ Created: "${postData.title}"`);
        }

        // Update author's total posts
        await User.findByIdAndUpdate(author._id, {
            $set: { 
                "account_info.total_posts": samplePosts.length,
                "blogs": await Blog.find({ author: author._id }).distinct('_id')
            }
        });

        console.log(`🎉 Successfully seeded ${samplePosts.length} blog posts!`);
        console.log('📊 Posts created with random engagement metrics');
        
    } catch (error) {
        console.error('❌ Error seeding posts:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the seeding function
seedPosts();