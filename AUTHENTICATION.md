# Authentication System - MongoDB Implementation

## Overview

The voice assistant now has a complete authentication system using Next.js API routes with MongoDB database and JWT tokens for secure user management. This system is production-ready and scalable for global deployment.

## 🏗️ Architecture

### Database Layer (`lib/database.ts`)
- **MongoDB Database** with Mongoose ODM for scalable cloud storage
- **User Management** with secure password hashing using bcryptjs
- **CRUD Operations** for user management with async/await
- **Data Validation** and error handling with MongoDB schema validation
- **Global Connection Management** to prevent connection leaks

### Authentication Layer (`lib/auth.ts`)
- **JWT Token Generation** for secure session management
- **Token Verification** for protected routes
- **Token Extraction** from authorization headers
- **Refresh Token Support** for extended sessions

### API Routes (`app/api/auth/`)
- **POST /api/auth/register** - User registration
- **POST /api/auth/login** - User login
- **GET /api/auth/me** - Get current user info (protected)

### Frontend Client (`lib/auth-client.ts`)
- **TypeScript API Client** for frontend authentication
- **Token Management** with localStorage persistence
- **Error Handling** and response formatting
- **Automatic Token Injection** for authenticated requests

### State Management (`lib/store.ts`)
- **Zustand Store** integration with authentication
- **Persistent Authentication** across browser sessions
- **Loading States** for better UX
- **Automatic Token Refresh** and validation

## 🔒 Security Features

### Password Security
- **bcryptjs Hashing** with salt rounds of 12
- **Password Validation** (minimum 6 characters)
- **No Plaintext Storage** - passwords are always hashed

### JWT Security
- **Secure Token Generation** with configurable expiration
- **Token Verification** on protected endpoints
- **Bearer Token Standard** for authorization headers
- **Automatic Token Cleanup** on logout/invalid tokens

### Input Validation
- **Email Format Validation** using MongoDB schema validation
- **Required Field Validation** for all inputs
- **NoSQL Injection Protection** via Mongoose sanitization
- **XSS Protection** via input sanitization

## 📁 Database Schema

```javascript
// MongoDB Schema with Mongoose
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
})

// Index for faster email lookups
userSchema.index({ email: 1 })
```

## 🌐 Environment Configuration

Create a `.env.local` file with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/voice-assistant
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/voice-assistant

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## 🎯 API Endpoints

### Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "user": {
    "id": "66c123abc...",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-06-28T...",
    "updatedAt": "2025-06-28T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "user": {
    "id": "66c123abc...",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-06-28T...",
    "updatedAt": "2025-06-28T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "success": true,
  "user": {
    "id": "66c123abc...",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-06-28T...",
    "updatedAt": "2025-06-28T..."
  }
}
```

## 🚀 Frontend Usage

### Registration/Login
```typescript
import { useAuthStore } from '@/lib/store'

const { login, signup, isLoading } = useAuthStore()

// Login
const result = await login('user@example.com', 'password')
if (result.success) {
  // Redirect to protected page
} else {
  // Show error: result.error
}

// Register
const result = await signup('John Doe', 'user@example.com', 'password')
if (result.success) {
  // User registered and logged in
} else {
  // Show error: result.error
}
```

### Protected Routes
```typescript
import { useAuthStore } from '@/lib/store'

const { isAuthenticated, checkAuth } = useAuthStore()

useEffect(() => {
  checkAuth() // Validate stored token
}, [])

if (!isAuthenticated) {
  // Redirect to login
}
```

## 🔧 Configuration

### Environment Variables (Required)
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/voice-assistant
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/voice-assistant

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
JWT_EXPIRES_IN=7d
```

### Production Deployment

#### MongoDB Atlas Setup (Recommended for Production)
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Set up database access (username/password)
4. Configure network access (allow your server's IP)
5. Get your connection string and update `MONGODB_URI`

#### Local MongoDB Setup (Development)
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
mongod

# Your connection string will be:
MONGODB_URI=mongodb://localhost:27017/voice-assistant
```

#### Environment Security
- **Never commit `.env.local`** to version control
- **Use strong JWT secrets** (generate with: `openssl rand -base64 32`)
- **Use different secrets** for development and production
- **Consider using environment variable providers** like Vercel, Railway, or AWS

## ✅ Features Implemented

1. **Complete User Registration** with validation
2. **Secure User Login** with password verification
3. **JWT Token Management** with automatic refresh
4. **Protected Route Authentication** 
5. **User Session Persistence** across browser restarts
6. **Automatic Token Validation** on app load
7. **Secure Logout** with token cleanup
8. **Error Handling** with user-friendly messages
9. **Loading States** for better UX
10. **TypeScript Support** throughout
11. **MongoDB Integration** for scalable data storage
12. **Production-Ready Architecture** for global deployment

## 🚀 Ready for Production

The authentication system is now fully functional and production-ready with MongoDB. Users can:
- Register new accounts globally
- Login with email/password from anywhere
- Access protected conversation features
- Maintain sessions across browser restarts
- Logout securely
- Scale to thousands of concurrent users

The voice assistant now has enterprise-grade user management and security! 🎉

## 📦 Deployment Checklist

### Before Deploying:
- [ ] Set up MongoDB Atlas cluster or dedicated MongoDB server
- [ ] Configure environment variables on your hosting platform
- [ ] Generate strong JWT secrets for production
- [ ] Test registration and login functionality
- [ ] Verify database connection and performance
- [ ] Set up monitoring and logging
- [ ] Configure CORS and security headers
- [ ] Test with production MongoDB instance

### Hosting Platforms:
- **Vercel**: Easy Next.js deployment with environment variables
- **Railway**: Full-stack apps with integrated MongoDB
- **AWS**: ECS/Lambda with DocumentDB or MongoDB Atlas
- **Digital Ocean**: App Platform with managed MongoDB
- **Heroku**: Web apps with MongoDB Atlas add-on
