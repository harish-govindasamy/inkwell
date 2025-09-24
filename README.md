# 🖋️ Inkwell - MERN Stack Blogging Platform

A modern, full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Inkwell provides writers with a powerful, intuitive interface to create, publish, and manage their content.

## ✨ Features

### 🎨 **Rich Content Creation**
- **Rich Text Editor**: EditorJS integration with headers, lists, code blocks, quotes, images, and embeds
- **Image Upload**: Cloudflare R2 integration for banner and content images
- **Draft System**: Save drafts and publish when ready
- **SEO Optimization**: Meta descriptions and tags for better discoverability

### 👥 **User Management**
- **Authentication**: JWT-based authentication with Google OAuth
- **User Profiles**: Customizable profiles with social links
- **Dashboard**: Personal dashboard with blog management
- **Settings**: Profile editing and password management

### 💬 **Social Features**
- **Comments System**: Nested comments with replies
- **Like System**: Like/unlike blogs with real-time updates
- **Notifications**: Real-time notifications for likes, comments, and replies
- **Search & Discovery**: Search blogs and users with filtering

### 📱 **Modern UI/UX**
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Theme support with CSS variables
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: WCAG compliant design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudflare R2 account
- Firebase project (for Google OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harish-govindasamy/inkwell.git
   cd inkwell
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../inkwellFrontend
   npm install
   ```

4. **Set up environment variables**
   
   **Backend (server/.env)**:
   ```env
   DB_LOCATION=mongodb://localhost:27017/inkwell
   SECRET_ACCESS_KEY=your-jwt-secret-key
   R2_ACCOUNT_ID=your-cloudflare-account-id
   R2_ACCESS_KEY_ID=your-r2-access-key
   R2_SECRET_ACCESS_KEY=your-r2-secret-key
   R2_BUCKET=inkwell
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   ```

   **Frontend (inkwellFrontend/.env)**:
   ```env
   VITE_SERVER_DOMAIN=http://localhost:3000
   ```

5. **Start the development servers**
   
   **Terminal 1 (Backend)**:
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 (Frontend)**:
   ```bash
   cd inkwellFrontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
inkwell/
├── server/                 # Backend (Express.js)
│   ├── Schema/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Blog.js
│   │   ├── Comment.js
│   │   └── Notification.js
│   └── server.js          # Main server file
├── inkwellFrontend/       # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── common/        # Utility functions
│   │   └── contexts/      # React contexts
│   └── public/            # Static assets
└── README.md
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **EditorJS** - Rich text editor
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Firebase Admin SDK** - Google OAuth
- **Cloudflare R2** - File storage

## 📚 API Documentation

### **Authentication**
- `POST /signup` - User registration
- `POST /signin` - User login
- `POST /google-auth` - Google OAuth
- `POST /change-password` - Change password
- `POST /update-profile` - Update user profile

### **Blogs**
- `POST /create-blog` - Create new blog
- `GET /latest-blogs` - Get latest blogs
- `GET /trending-blogs` - Get trending blogs
- `GET /get-blog/:blog_id` - Get individual blog
- `GET /search-blogs` - Search blogs
- `DELETE /delete-blog` - Delete blog

### **Comments**
- `POST /add-comment` - Add comment
- `GET /get-blog-comments` - Get blog comments
- `DELETE /delete-comment` - Delete comment

### **Interactions**
- `POST /like-blog` - Like/unlike blog
- `GET /is-liked-by-user` - Check if blog is liked

### **Users**
- `GET /get-user/:user_id` - Get user profile
- `GET /search-users` - Search users

### **Notifications**
- `GET /notifications` - Get user notifications
- `POST /mark-notification` - Mark notification as read

## 🚀 Deployment

### **Backend Deployment (Render)**
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### **Frontend Deployment (Netlify/Vercel)**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

### **Database (MongoDB Atlas)**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `DB_LOCATION` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [EditorJS](https://editorjs.io/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) - Object storage
- [Firebase](https://firebase.google.com/) - Authentication

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Built with ❤️ using the MERN stack**