# Complete MERN Stack Blogging Website Tutorial Guide

This comprehensive Markdown guide covers all six parts of the **Modern Web** YouTube tutorial series for building a MERN stack blogging platform using Cloudflare R2 storage (R4 bucket compatible).

## Table of Contents
1. [Part 1: Authentication & Setup](#part-1-authentication--setup)
2. [Part 2: Blog Editor & Publishing](#part-2-blog-editor--publishing)
3. [Part 3: Homepage & Search](#part-3-homepage--search)
4. [Part 4: Blog Pages & Interactions](#part-4-blog-pages--interactions)
5. [Part 5: User Settings & Profile Management](#part-5-user-settings--profile-management)
6. [Part 6: Dashboard & Deployment](#part-6-dashboard--deployment)
7. [Technical Architecture](#technical-architecture)
8. [Setup & Deployment](#setup--deployment)
9. [Next Steps & Best Practices](#next-steps--best-practices)

---

## Part 1: Authentication & Setup
**Duration:** 4:52:50  
**YouTube Link:** https://youtu.be/J7BGuuuvDDk

### Key Sections
- Project scaffolding with Vite (React) and Express.js
- Tailwind CSS integration
- React Router DOM setup
- **User Authentication:**
  - Sign Up & Sign In forms
  - JWT-based authentication
  - Firebase Admin SDK for Google OAuth
- Protected routes with `<Navigate>`
- Form validation (client/server)
- Session management & context
- Navbar component with responsive design

### Technologies
- React 18, Vite, Tailwind CSS
- Express.js, MongoDB (Mongoose)
- JWT, bcrypt, Firebase Admin

---

## Part 2: Blog Editor & Publishing
**Duration:** 5:09:44  
**YouTube Link:** https://youtu.be/pGFy_uGtpCA

### Key Sections
- `/editor` route setup
- **Rich Text Editor:** EditorJS integration
- Blog Editor component structure
- Publish & Save Draft buttons
- **Banner Image Upload:**
  - Cloudflare R2 bucket (R4-compatible)
  - Multer for file parsing
  - Generating signed upload URLs
- Editor Context for state management
- Publish Form component (SEO metadata)
- API route `/get-upload-url` and `/create-blog`
- Draft saving workflow

### New Libraries
- `@editorjs/editorjs`  
- `@cloudflare/r2` SDK  
- `multer`

---

## Part 3: Homepage & Search
**Duration:** 5:05:22  
**YouTube Link:** https://youtu.be/mdnZYrcUj6E

### Key Sections
- Home route and tabbed navigation
- Fetch latest blogs (`/latest-blogs` API)
- BlogCard & TrendingBlogCard components
- Infinite scroll with "Load More"
- Category/tag filtering
- Search API endpoints: `/search-blogs`, `/search-users`
- Search Page with results display
- 404 Page component
- User Profile routes (`/user/:id`)

### Data Flow
1. Fetch paginated blogs on mount
2. Append new blogs on scroll
3. Filter API calls by tag
4. Search with query parameters

---

## Part 4: Blog Pages & Interactions
**Duration:** 6:08:27  
**YouTube Link:** https://youtu.be/_Li6It0lWDs

### Key Sections
- Blog page route `/blog/:blogId`
- View count tracking on GET `/get-blog/:blogId`
- **BlogContentRenderer:** parse EditorJS output
- BlogInteraction component:
  - Like/Unlike (`/like-blog`)
  - Comment modal toggle
  - Share via Twitter link
- Similar Blogs recommendation by tag match

### Comment System
- Nested comments with parent/children
- CommentCard & CommentsWrapper components
- APIs: `/add-comment`, `/get-blog-comments`, `/get-replies`, `/delete-comment`
- Permission checks for delete

---

## Part 5: User Settings & Profile Management
**Duration:** 3:36:29  
**YouTube Link:** https://youtu.be/bhCPajnV7NY

### Key Sections
- Settings route with sidebar navigation
- **Edit Profile:**
  - Update username, bio, social links
  - Profile image upload to Cloudflare R2
- **Change Password:**
  - Current & new password validation
  - API `/change-password` with bcrypt
- Dashboard links to blog management & notifications

### Security
- Password pattern enforcement
- Auth middleware on settings routes

---

## Part 6: Dashboard & Deployment
**Duration:** 6:32:49  
**YouTube Link:** https://youtu.be/dtTVbC-GvFI

### Key Sections
- Notification system UI:
  - Real-time alert indicator
  - Filter likes/comments/replies
  - API `/notifications`
- **Blog Management Dashboard:**
  - Published vs Draft tabs
  - Stats: likes, reads, comments
  - Edit & Delete actions
- Dark theme support with CSS variables
- Role-based admin controls (optional)
- **Production Deployment:**
  - Backend on Render
  - Frontend on Netlify with redirects

---

## Technical Architecture

### Backend (Express.js)
```js
// Key API routes
POST /signup
POST /signin
POST /google-auth
GET  /get-upload-url
POST /create-blog
GET  /latest-blogs
GET  /trending-blogs
GET  /search-blogs
GET  /search-users
GET  /get-blog/:blogId
POST /like-blog
GET  /is-liked-by-user
POST /add-comment
GET  /get-blog-comments
GET  /get-replies
DELETE /delete-comment
GET  /notifications
POST /change-password
POST /update-profile
```

### Database Schemas (Mongoose)
- **User**: personal_info, social_links, stats, google_auth, blogs[]
- **Blog**: title, content, bannerURL, tags[], author, stats, comments[], draft
- **Comment**: blogId, parent, children[], author, text
- **Notification**: type, blogRef, userRef, seen

### Frontend (React)
- React Context for auth & theme
- Axios service for API calls
- EditorJS for blog content
- Framer Motion for animations
- Tailwind CSS for styling

---

## Setup & Deployment

### Prerequisites
- Node.js ≥16, npm
- MongoDB (local/Atlas)
- Cloudflare R4 bucket credentials
- Firebase project credentials

### Installation
```bash
# Clone
git clone https://github.com/kunaal438/mern-blogging-website.git

# Backend
cd mern-blogging-website/server
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Variables (`.env`)
```env
DB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_R2_ACCESS_KEY_ID=...
CF_R2_SECRET_ACCESS_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

### Run
```bash
# In one terminal
cd server
npm start

# In another
cd frontend
npm run dev
```

### Deploy
- **Backend**: Connect GitHub repo to Render, set env vars
- **Frontend**: Build (`npm run build`) and deploy to Netlify, configure `_redirects`

---

## Next Steps & Best Practices
- Complete search indexing for performance
- Add automated testing (Jest, Cypress)
- Implement rate limiting on APIs
- Monitor with Sentry and Logflare
- Optimize image delivery with Cloudflare Images
- Add internationalization support
