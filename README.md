# Competitive Programming Platform API

A robust, highly secure RESTful backend API designed to power a competitive programming platform. This system handles user authentication, advanced Role-Based Access Control (RBAC), algorithmic problem datasets, and a rating-gated community blogging system.

## 🚀 Tech Stack

* Runtime Environment: Node.js
* Web Framework: Express.js
* Database: MongoDB
* Object Data Modeling (ODM): Mongoose
* Authentication & Security: JSON Web Tokens (JWT), bcrypt

## ⚙️ Core Architecture & Features

### 1. Advanced Authentication & Session Management
* Dual Login: Users can authenticate using either their unique competitive programming handle or their email address.
* Password Cryptography: All user passwords are automatically salted and hashed using bcrypt before database insertion.
* Stateless Authentication: Implemented JWT-based authentication with HTTP-only cookies to manage access tokens and refresh tokens, neutralizing Cross-Site Scripting (XSS) attack vectors.

### 2. Role-Based Access Control (RBAC) & Middleware
* Custom Auth Middleware: Developed Express middlewares to intercept requests, decode JWTs, and seamlessly attach user contexts to the request pipeline.
* Tiered Authorization: Granular access control distinguishing between standard users, rated competitive programmers, and platform administrators.

### 3. Rating-Gated Blogging & Commenting System
* Community Features: Engineered a full CRUD system for user blogs and hierarchical comments.
* Rating-Based Authorization: Leveraged user competitive programming ratings to gate content creation. Only users who have achieved a certified rating threshold are authorized to publish community blogs.
* Admin Moderation & Data Integrity: Implemented a soft-delete architecture. Administrators can remove inappropriate blogs or comments from the public view without permanently erasing the records from the MongoDB database, preserving data for audits.

### 4. Problem Management
* NoSQL Schemas: Engineered structured Mongoose schemas to effectively store, query, and serve complex algorithmic problem descriptions, constraints, and metadata.

## 📡 Key API Endpoints (Overview)

| HTTP Method | Endpoint | Description | Authorization Level |
| :--- | :--- | :--- | :--- |
| POST | /api/auth/login | Authenticate user & set cookies | Public |
| POST | /api/auth/refresh | Generate new access token | Secure |
| GET | /api/problems | Fetch all algorithmic problems | Public |
| POST | /api/blogs | Create a new community blog | Rated User Only |
| POST | /api/blogs/:id/comments | Post a comment on a blog | Secure |
| DELETE| /api/blogs/:id | Soft-delete a blog post | Admin Only |
| DELETE| /api/comments/:id| Soft-delete a comment | Admin Only |

## 🛠 Local Development Setup

To run this project locally on your machine:

1. Clone the repository:
   ```bash
   git clone [https://github.com/zein1634/cp-platform-backend.git](https://github.com/zein1634/cp-platform-backend.git)
