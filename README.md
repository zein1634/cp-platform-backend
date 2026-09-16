# Competitive Programming Platform API

A robust, highly secure RESTful backend API designed to power a competitive programming platform. This system handles user authentication, Role-Based Access Control (RBAC), algorithmic problem datasets, and a rating-gated community blogging system.

## 🚀 Tech Stack

- Runtime Environment: Node.js
- Web Framework: Express.js
- Database: MongoDB
- Object Data Modeling (ODM): Mongoose
- Authentication & Security: JSON Web Tokens (JWT), bcrypt

## ⚙️ Core Architecture & Features

### 1. Advanced Authentication & Session Management

- Dual Login: Users can authenticate using either their unique competitive programming handle or their email address.
- Password Cryptography: Passwords are salted and hashed with bcrypt before database insertion.
- Stateless Authentication: JWT-based auth with HTTP-only cookies — a short-lived access token (15 min) and a rotating refresh token (7 days), whose hash is stored in the database.

### 2. Role-Based Access Control (RBAC) & Middleware

- Custom Auth Middleware: Express middlewares decode JWTs and attach the user context to the request pipeline.
- Tiered Authorization: Distinguishes between standard users, rated competitive programmers, and staff members.

### 3. Rating-Gated Blogging & Commenting System

- Full CRUD for user blogs and comments.
- Only users with a rating (non-null) can publish blogs.
- Only the original author or a staff member can edit/delete a blog or comment.
- Deletion is a soft-delete: records stay in MongoDB but are hidden from public view.

### 4. Problem Management

- Mongoose schemas to store, filter (by tags/rating), and sort algorithmic problems.

## 📡 Key API Endpoints

> Base URL: /codeforces

| HTTP Method | Endpoint | Description | Authorization |
|---|---|---|---|
| POST | /register | Register a new user | Public |
| POST | /login | Authenticate & set cookies | Public |
| POST | /auth/token | Rotate the access/refresh token pair | Valid refresh-token cookie |
| POST | /auth/logout | Revoke refresh token & clear cookies | Public |
| GET | /problemset | List problems (filter/sort by tags, rating, order) | Public |
| GET | /problem/:id | Get a single problem | Public |
| POST | /problemset | Create a new problem | Staff Only |
| GET | /blogs | List latest blogs | Public |
| GET | /blog/:blogId | Get a single blog with its comments | Public |
| POST | /blogs | Create a new blog | Rated User Only |
| PATCH | /blog/:blogId | Update a blog | Author or Staff |
| DELETE | /blog/:blogId | Soft-delete a blog | Author or Staff |
| POST | /blog/:blogId/comments | Post a comment on a blog | Logged-in User |
| PATCH | /comment/:id | Update a comment | Author or Staff |
| DELETE | /comment/:id | Soft-delete a comment | Author or Staff |

## 🛠 Local Development Setup

1. Clone the repository:
git clone https://github.com/zein1634/cp-platform-backend.git
cd cp-platform-backend
2. Install dependencies:
npm install
3. Create a .env file in the project root:
MONGO_URI=your_mongodb_connection_string
PORT=3000
SECRET_KEY=your_access_token_secret
REFRESH_SECRET_KEY=your_refresh_token_secret
NODE_ENV=development
4. Run the server:
npm run dev
or in production mode:
npm start
