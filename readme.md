# 🚀 Project Management API

Backend API built with **Node.js, Express, and MongoDB** featuring secure authentication and scalable architecture.

---

## ✨ Features

* 🔐 JWT Authentication (Access + Refresh Tokens)
* 📝 User Registration & Login
* 🔒 Protected Routes (Middleware)
* 📧 Email Verification
* 🔑 Password Reset & Change
* 👤 Get Current User

---

## 🔢 API Base

```bash
/api/v1/...
```

---

## 🛠️ Tech Stack

* Node.js, Express.js
* MongoDB (Mongoose)
* JWT
* bcrypt / bcryptjs
* dotenv

---

## 📁 Structure

```bash
controllers/
models/
routes/
middlewares/
validators/
utils/
```

---

## 🔐 Auth Flow

* User logs in → server generates JWT
* Token sent via cookies / headers
* Middleware verifies token for protected routes

---

## 🔄 Refresh Token

* Used to generate new access tokens
* Improves security and user experience

---

## 📌 API Endpoints

### Auth

* POST `/api/v1/auth/register`
* POST `/api/v1/auth/login`
* POST `/api/v1/auth/logout`
* POST `/api/v1/auth/refresh-token`

### Email

* GET `/api/v1/auth/verify-email/:token`
* POST `/api/v1/auth/resend-email-verification`

### Password

* POST `/api/v1/auth/forgot-password`
* POST `/api/v1/auth/reset-password/:token`
* POST `/api/v1/auth/change-password`

### User

* GET `/api/v1/auth/current-user`

### Health

* GET `/api/v1/healthcheck`

---

## 🔄 Future Updates

* Project & Task Management
* Role-Based Access Control
* Logging System

---

## 👨‍💻 Author

Ankit Kumar
GitHub: https://github.com/Arceusdll
g