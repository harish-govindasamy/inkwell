import mongoose from 'mongoose';
import 'dotenv/config';
import Blog from './Schema/Blog.js';

// Connect to MongoDB
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

async function checkBlogContent() {
    try {
        const blogs = await Blog.find().limit(1);
        if (blogs.length > 0) {
            console.log('Blog structure:', JSON.stringify(blogs[0].content, null, 2));
            console.log('Blog title:', blogs[0].title);
            console.log('Blog ID:', blogs[0].blog_id);
        } else {
            console.log('No blogs found in database');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkBlogContent();