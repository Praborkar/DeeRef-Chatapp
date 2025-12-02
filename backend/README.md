# Real-time Team Chat Backend

Backend for a Slack-like real-time chat app using Node.js, Express, Socket.IO, JWT and MongoDB Atlas.

## Features
- User signup & login (JWT)
- Authentication middleware for protected routes
- Real-time messaging (Socket.IO)
- Online/offline presence tracking (handles multiple tabs)
- Channels: create, join, leave, list
- Messages: send (Socket.IO), store in MongoDB, fetch with pagination
- Clean modular structure
- CORS enabled (`{ origin: "*" }`)

## Folder Structure
