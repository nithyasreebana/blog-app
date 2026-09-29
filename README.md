# Blogify — Complete MERN Blogging Platform

A full-stack, production-grade MERN (MongoDB, Express, React, Node.js) blogging application with authentication, role-based access control, categories, search, rich comments, likes, bookmarks, and image uploads.

---

## 📂 Project Architecture

```
blog-app/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── api/axios.js         # Configured Axios instance with JWT interceptor
│   │   ├── context/AuthContext.jsx # Global auth state (login, register, logout)
│   │   ├── styles/index.css     # Clean light theme design system (Vanilla CSS)
│   │   ├── components/          # 23 modular reusable components
│   │   │   ├── auth/            # ProtectedRoute, AdminRoute
│   │   │   ├── blog/            # PostCard, PostList, LikeButton, BookmarkButton, etc.
│   │   │   ├── comment/         # CommentList, CommentItem, CommentForm
│   │   │   ├── common/          # Navbar, Footer, Loader, Alert, Modal, Avatar, Badge, etc.
│   │   │   └── forms/           # FormInput, FormTextarea, ImageUploadPreview
│   │   ├── pages/               # Home, PostDetails, CreateEditPost, Login, Register, Profile, Bookmarks, Admin
│   │   ├── App.jsx              # React Router setup
│   │   └── main.jsx
│   ├── index.html               # Main HTML with SEO meta tags
│   ├── vite.config.js           # Vite dev proxy configuration
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth actions (register, login, me, logout)
│   │   ├── blogController.js    # Posts CRUD, search, filter, like
│   │   ├── categoryController.js# Categories CRUD & post count
│   │   ├── commentController.js # Comments per post
│   │   └── userController.js    # Profile, avatar, bookmarks, user management
│   ├── middleware/
│   │   ├── auth.js              # JWT Bearer token authentication
│   │   ├── role.js              # RBAC authorization (user, admin)
│   │   ├── upload.js            # Multer image upload filter & 5MB limit
│   │   ├── validator.js         # express-validator schemas & runner
│   │   └── errorHandler.js      # Central JSON error handling middleware
│   ├── models/
│   │   ├── user.js              # User schema (bcrypt, bookmarks, bio, role)
│   │   ├── blog.js              # Blog post schema (tags, category, likes, indexes)
│   │   ├── category.js          # Category schema (name, slug, description)
│   │   └── comment.js           # Comment schema (blogId, createdBy)
│   ├── routes/
│   │   ├── auth.js              # /api/auth
│   │   ├── blogs.js             # /api/blogs
│   │   ├── categories.js        # /api/categories
│   │   └── users.js             # /api/users
│   ├── uploads/                 # Uploaded avatars and cover images
│   ├── index.js                 # Express server entry point
│   ├── .env                     # Server environment variables
│   ├── .env.example             # Sample environment variables
│   └── package.json
│
├── .gitignore                   # Git ignore rules
├── .env.example                 # Root reference environment variables
├── README.md
└── package.json                 # Root script runner for client and server
```

---

## 🌟 Features

### Backend (`server/`)
- **RESTful JSON API**: Pure JSON API with consistent response formatting and centralized error handling.
- **Secure Authentication**: Password hashing with `bcryptjs`, signed `JWT` tokens, and flexible `Bearer` header / HTTP-only cookie support.
- **Role-Based Access Control (RBAC)**:
  - `"user"`: Can create stories, edit/delete their own stories and comments, like posts, and bookmark reads.
  - `"admin"`: Full administrative moderation to delete any post or comment, manage categories, and oversee users.
- **Blog Posts & Publishing**:
  - Full CRUD with pagination (`page`, `limit`, `totalPages`, `hasMore`).
  - Text search across `title`, `body`, and `tags`.
  - Filter by category and author.
  - Multipart image uploads with `Multer` (5MB limit, image MIME filter).
- **Categories**: Dynamic category management with post count aggregation.
- **Comments**: Per-post discussion with edit, delete, and author population.
- **Likes & Bookmarks**: Real-time counter and user library tracking.
- **User Profile**: Bio, name updates, and avatar image uploads.
- **Input Validation**: Request validation and sanitization using `express-validator`.
- **Database Performance**: Mongoose indexes on text fields, createdBy, category, and foreign keys.

### Frontend (`client/`)
- **Modern SPA**: Built with React 18, Vite, and React Router.
- **Vanilla CSS Design System**: Lightweight, responsive light-theme styling with clean typography and zero heavy UI library dependencies.
- **23 Reusable Components**: `Navbar`, `Footer`, `PostCard`, `PostList`, `CategoryFilter`, `SearchBar`, `Pagination`, `CommentList`, `CommentItem`, `CommentForm`, `LikeButton`, `BookmarkButton`, `ProtectedRoute`, `AdminRoute`, `Loader`, `Alert`, `SuccessMessage`, `Modal`, `Avatar`, `Badge`, `FormInput`, `FormTextarea`, `ImageUploadPreview`.
- **8 Responsive Pages**:
  - **Home**: Search, category pills filter, responsive feed, and pagination.
  - **Post Details**: Full story reading view, tags, likes, bookmarks, and interactive comments.
  - **Create / Edit Post**: Post authoring with live cover image preview and category selector.
  - **Login / Register**: Form validation with clear error feedback.
  - **Profile**: Account details, avatar upload, and user's published stories management.
  - **Bookmarks**: Saved reading list.
  - **Admin Control Center**: Categories CRUD, post moderation, and user management.

---

## 🚀 Quick Start Guide

### 1. Installation
Install all dependencies for both `server` and `client` with one command from the project root:
```bash
npm run install:all
```
*(Or install individually inside `server` and `client` directories)*

### 2. Environment Setup
The server configuration resides in `server/.env`:
```bash
cp server/.env.example server/.env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` | Port for the Express server |
| `MONGO_URI` | `mongodb://localhost:27017/blogify` | MongoDB connection URI |
| `JWT_SECRET` | `supersecretkey_change_this_in_production` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token validity duration |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |

---

### 3. Running the Application

You can run both from the root directory:

**Terminal 1 (Backend Server):**
```bash
npm run server
```
*Server runs on `http://localhost:5001`*

**Terminal 2 (Frontend Client):**
```bash
npm run client
```
*Client runs on `http://localhost:5173`*

---

## 📡 API Reference

All responses return consistent JSON:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`fullName`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login user and receive JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |
| `POST` | `/api/auth/logout` | Public | Logout and clear cookie |

### 2. Blog Posts (`/api/blogs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs` | Public | List posts (params: `page`, `limit`, `search`, `category`, `tag`, `author`) |
| `GET` | `/api/blogs/:id` | Public | Get single blog post by ID |
| `POST` | `/api/blogs` | Private | Create new post (multipart: `title`, `body`, `category`, `tags`, `coverImage`) |
| `PUT` | `/api/blogs/:id` | Owner / Admin | Update post |
| `DELETE`| `/api/blogs/:id` | Owner / Admin | Delete post and cascade remove comments |
| `POST` | `/api/blogs/:id/like` | Private | Toggle like / unlike on post |

### 3. Comments (`/api/blogs/:blogId/comments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs/:blogId/comments` | Public | Get all comments for a post |
| `POST` | `/api/blogs/:blogId/comments` | Private | Add comment (`content`) |
| `PUT` | `/api/blogs/:blogId/comments/:commentId` | Owner | Edit comment |
| `DELETE`| `/api/blogs/:blogId/comments/:commentId` | Owner / Admin | Delete comment |

### 4. Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Get all categories with post count |
| `GET` | `/api/categories/:id` | Public | Get category by ID or slug |
| `POST` | `/api/categories` | Admin | Create category (`name`, `description`) |
| `PUT` | `/api/categories/:id` | Admin | Update category |
| `DELETE`| `/api/categories/:id` | Admin | Delete category |

### 5. Users & Bookmarks (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Private | Get current user's profile |
| `PUT` | `/api/users/profile` | Private | Update profile (multipart: `fullName`, `bio`, `avatar`) |
| `GET` | `/api/users/bookmarks` | Private | Get bookmarked stories list |
| `POST` | `/api/users/bookmarks/:blogId` | Private | Toggle bookmark on/off |
| `GET` | `/api/users/:id/posts` | Public | Get posts by user ID |
| `GET` | `/api/users/:id` | Public | Get public user profile |
| `GET` | `/api/users` | Admin | List all registered users |
| `DELETE`| `/api/users/:id` | Admin | Delete user account (Admin only) |
