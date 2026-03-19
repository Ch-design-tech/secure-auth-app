# Secure Authentication API (JWT)

## Overview
Built a secure REST API with authentication and authorization using JWT.

## Features
- User registration with bcrypt password hashing
- JWT-based login authentication
- Protected routes using middleware
- Environment variable security with dotenv

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- bcrypt

## Endpoints
- POST /register
- POST /login
- GET /dashboard (protected)

## How to Run
1. Clone repo
2. Run `npm install`
3. Create `.env` file with:
   - MONGO_URI
   - JWT_SECRET
4. Run `node server.js`