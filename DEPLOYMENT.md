# 🚀 Deployment Guide for Inkwell

This guide will help you deploy your MERN blog platform to production using Render (backend) and Netlify (frontend).

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account
- [ ] Cloudflare R2 account
- [ ] Firebase project for Google OAuth
- [ ] Render account
- [ ] Netlify account

## 🔧 Environment Setup

### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for Render)
5. Get your connection string

### 2. Cloudflare R2 Setup
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to R2 Object Storage
3. Create a new bucket
4. Generate API tokens
5. Note down your Account ID, Access Key, and Secret Key

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication > Google
4. Generate service account key
5. Note down Project ID, Client Email, and Private Key

## 🖥️ Backend Deployment (Render)

### Step 1: Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the `server` folder as the root directory

### Step 2: Configure Service
- **Name**: `inkwell-backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid for production)

### Step 3: Set Environment Variables
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
DB_LOCATION=mongodb+srv://username:password@cluster.mongodb.net/inkwell
SECRET_ACCESS_KEY=your-jwt-secret-key
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET=inkwell
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note down your backend URL (e.g., `https://inkwell-backend.onrender.com`)

## 🌐 Frontend Deployment (Netlify)

### Step 1: Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Select the `inkwellFrontend` folder as the base directory

### Step 2: Configure Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `18`

### Step 3: Set Environment Variables
Add these environment variables in Netlify dashboard:

```env
VITE_SERVER_DOMAIN=https://inkwell-backend.onrender.com
```

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for deployment to complete
3. Note down your frontend URL (e.g., `https://inkwell-blog.netlify.app`)

## 🔄 Update Backend CORS

After getting your frontend URL, update the backend CORS settings:

1. Go to your Render service
2. Add environment variable:
   ```env
   FRONTEND_URL=https://inkwell-blog.netlify.app
   ```

3. Update your `server.js` CORS configuration:
   ```javascript
   server.use(cors({
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true
   }));
   ```

4. Redeploy the backend service

## 🧪 Testing Deployment

### 1. Test Backend
```bash
curl https://inkwell-backend.onrender.com/latest-blogs
```

### 2. Test Frontend
1. Visit your Netlify URL
2. Test user registration
3. Test blog creation
4. Test all features

### 3. Test Database Connection
1. Check Render logs for database connection
2. Verify MongoDB Atlas connection
3. Test API endpoints

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to Git
- Use strong, unique secrets
- Rotate secrets regularly

### 2. CORS Configuration
- Set specific allowed origins
- Don't use wildcard (*) in production

### 3. Database Security
- Use strong database passwords
- Whitelist specific IP addresses
- Enable MongoDB Atlas security features

## 📊 Monitoring & Maintenance

### 1. Render Monitoring
- Monitor service health
- Check logs for errors
- Set up alerts for downtime

### 2. Netlify Monitoring
- Monitor build status
- Check function logs
- Set up form notifications

### 3. Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for high usage
- Regular backup verification

## 🚨 Troubleshooting

### Common Issues

#### Backend Issues
- **Build Failures**: Check Node.js version compatibility
- **Database Connection**: Verify MongoDB Atlas whitelist
- **Environment Variables**: Ensure all required vars are set

#### Frontend Issues
- **Build Failures**: Check for TypeScript errors
- **API Calls**: Verify backend URL in environment variables
- **CORS Errors**: Check backend CORS configuration

#### Database Issues
- **Connection Timeout**: Check MongoDB Atlas cluster status
- **Authentication**: Verify database user credentials
- **Network**: Check IP whitelist settings

### Debugging Steps
1. Check service logs in Render/Netlify
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors
5. Verify database connection

## 📈 Performance Optimization

### 1. Backend Optimization
- Enable gzip compression
- Implement caching strategies
- Optimize database queries
- Use CDN for static assets

### 2. Frontend Optimization
- Enable Netlify's build optimizations
- Implement lazy loading
- Optimize images
- Use service workers

### 3. Database Optimization
- Create proper indexes
- Monitor query performance
- Implement connection pooling
- Regular maintenance

## 🔄 CI/CD Pipeline

### Automatic Deployments
- **Backend**: Deploys on push to main branch
- **Frontend**: Deploys on push to main branch
- **Database**: Manual migrations

### Manual Deployments
- **Backend**: Trigger redeploy in Render dashboard
- **Frontend**: Trigger redeploy in Netlify dashboard

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review service logs
3. Verify environment variables
4. Test locally first
5. Contact support if needed

---

**Your MERN blog platform is now deployed and ready for production use!** 🎉
