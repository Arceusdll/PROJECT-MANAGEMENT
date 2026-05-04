# 🚀 Project Management API

A backend API built using **Node.js, Express, and MongoDB**.
This project focuses on authentication, authorization, and building a scalable backend structure.

---

## 📌 Features

* 🔐 JWT-based Authentication & Authorization
* 📝 User Registration & Login System
* 🔒 Protected Routes with Middleware
* 🚪 Secure Logout System
* 📂 Project Routes (basic structure implemented)

---

## 🔢 API Versioning

This project uses versioned routes:

```
/api/v1/...
```

This ensures scalability and backward compatibility for future updates.

---

## 🛠️ Tech Stack

| Category       | Technology          |
| -------------- | ------------------- |
| Backend        | Node.js, Express.js |
| Database       | MongoDB (Mongoose)  |
| Authentication | JWT                 |
| Security       | bcrypt / bcryptjs   |
| Config         | dotenv              |

---

## 🏗️ Architecture Overview

```
Client → Routes → Controllers → Database
            ↓
      Middleware (Auth, Errors)
```

---

## 📁 Folder Structure

```
project/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── app.js
├── index.js
└── .env
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Arceusdll/PROJECT-MANAGEMENT.git
cd PROJECT-MANAGEMENT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 4. Run Server

```bash
npm run dev
```

---

## 🔐 Authentication Flow

1. User registers
2. User logs in → receives **JWT access token**
3. Token is sent via cookies or Authorization header
4. Protected routes verify token before granting access

---

## 📌 API Endpoints

### Auth Routes

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | /api/v1/auth/register | Register user |
| POST   | /api/v1/auth/login    | Login user    |
| POST   | /api/v1/auth/logout   | Logout user   |

### Health Check

| Method | Endpoint            | Description   |
| ------ | ------------------- | ------------- |
| GET    | /api/v1/healthcheck | Server status |

---

## 🧪 Sample Test Routes

* GET `/` → Basic server test
* GET `/instagram` → Demo route

---

## 🛡️ Middleware Used

* JWT Authentication Middleware
* Error Handling Middleware
* Cookie Parser

---

## 🔄 Future Updates

* 📂 Full Project Management (CRUD)
* ✅ Task Creation & Scheduling
* ⏳ Task Expiry System
* 🔁 Refresh Token System
* 👥 Role-Based Access Control
* 📊 Logging (Morgan / Winston)

---

## 🧠 Key Learnings

* JWT Authentication & Authorization
* REST API Design
* Middleware Handling
* MongoDB Schema Design
* Backend Architecture

---

## 👨‍💻 Author

**Ankit Kumar**

* GitHub: https://github.com/Arceusdll

---

## ⭐ Support

If you like this project, consider giving it a ⭐!
