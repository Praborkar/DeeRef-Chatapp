# 🚀 Real-Time Team Chat Application  
### **Discord Full-Stack Chat App (React + Node.js + Socket.IO + MongoDB)**

A complete real-time chat application featuring authentication, channels, real-time messaging, online presence, and message pagination.  
Frontend built with **React, Vite, Tailwind, React Query, Socket.IO client**.  
Backend built with **Node.js, Express, Socket.IO, MongoDB, JWT, Mongoose**.

---

# 📌 Features Overview

### ✅ **Frontend Features**
- 🔐 JWT Authentication (Login + Signup)
- 🧭 Protected Routes with Redirects
- 📡 Real-time messaging (Socket.IO client)
- 💬 Slack-like UI using Tailwind CSS
- 📚 Message history with **infinite scroll pagination**
- 🔔 Online/offline presence sidebar
- 📁 Channel system:
  - List channels
  - Create new channel (modal)
  - Join / Leave channels
- 💾 LocalStorage token persistence
- 🎨 Clean 3-column layout:  
  **Sidebar → Chat → Presence panel**
- 🚀 React Query for data fetching + caching

---

### ✅ **Backend Features**
- 🔐 JWT-based Authentication (Signup & Login)
- ⚡ Real-time messaging with Socket.IO
- 🎯 Presence tracking (online/offline)
- 💾 MongoDB Atlas + Mongoose models:
  - Users
  - Channels
  - Messages
  - Presence
- 📡 Pagination API (20 messages per page)
- 🔒 Auth middleware for protected routes
- 🌐 CORS enabled for frontend access
- 🧩 Modular folder structure
- ☁️ Ready for Render Deployment

---

# 📁 Folder Structure

```
frontend/
  src/
    api/
    components/
    pages/
    hooks/
    context/
    layout/
    App.jsx
    main.jsx

backend/
  src/
    models/
    routes/
    middleware/
    socket/
    config/
    server.js
  package.json
  .env
```

---

# ⚙️ Frontend Setup Guide

### 1️⃣ **Clone Repository**
```sh
git clone https://github.com/your-repo/chat-app.git
cd frontend
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Create ENV**
Create `.env` inside `frontend/`

```
VITE_API_URL=http://localhost:4000
```

### 4️⃣ **Run Dev Server**
```sh
npm run dev
```

---

# 🌐 Backend Setup Guide

### 1️⃣ **Install Dependencies**
```sh
cd backend
npm install
```

### 2️⃣ **Setup Environment Variables**

Create `.env`:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

### 3️⃣ **Run Backend**
```sh
npm run dev
```

Or production build:

```sh
npm start
```

---

# 🚀 Running Full System

1. Start backend:  
   ```sh
   cd backend && npm run dev
   ```

2. Start frontend:
   ```sh
   cd frontend && npm run dev
   ```

3. Visit the app:  
   👉 http://localhost:5173

---

# 🔌 Backend API Endpoints

### **Auth**
| Method | Endpoint | Description |
|--------|-------------|--------------|
| POST | /auth/signup | Create user |
| POST | /auth/login | Login + get JWT |

### **Channels**
| Method | Endpoint | Description |
|--------|-------------|--------------|
| GET | /channels | List all channels |
| POST | /channels | Create channel |
| POST | /channels/:id/join | Join channel |
| POST | /channels/:id/leave | Leave channel |

### **Messages**
| Method | Endpoint | Description |
|--------|-------------|--------------|
| GET | /messages/:channelId?page=n | Fetch paginated messages |

---

# ⚡ Real-Time Events (Socket.IO)

### Client → Server  
| Event | Payload |
|--------|---------|
| joinChannel | { channelId } |
| sendMessage | { channelId, text } |

### Server → Client  
| Event | Payload |
|--------|---------|
| newMessage | { message } |
| presence:update | [ { userId, isOnline } ] |

---

# 🗄 MongoDB Models

### ✔ **User**
- name  
- email  
- password  
- timestamps  

### ✔ **Channel**
- name  
- members: [userIds]

### ✔ **Message**
- channelId  
- userId  
- text  
- createdAt  

### ✔ **Presence**
- userId  
- isOnline  
- lastActive  

---

# 🧠 Frontend Architecture

### 🔹 Hooks
| Hook | Purpose |
|------|----------|
| useAuth | login/signup + token handling |
| useChannels | list/create/join/leave channels |
| useMessages | fetch + paginate messages |
| useSocket | socket connection wrapper |

### 🔹 Components
- Sidebar
- ChannelList
- ChatHeader
- MessageList + MessageItem
- ChatInput
- CreateChannelModal
- OnlineUsersPanel
- Loader

### 🔹 Context
- SocketProvider  
- Auth context (optional)

---

# 📸 UI Highlights

✔ Slack-style sidebar  
✔ Smooth message list with auto-scroll  
✔ Realtime status indicators  
✔ Modern fonts + Tailwind styling  

---

# 🌍 Deploying Backend on Render

1. Create new **Web Service**
2. Add repo → backend folder
3. Add ENV variables (Mongo URI, JWT secret)
4. Set build command:
```
npm install
```
5. Set start command:
```
node src/server.js
```

---

# 🌐 Deploying Frontend (Netlify / Vercel)

### Build command:
```
npm run build
```

### Output:
```
dist
```

Set `VITE_API_URL` to your deployed backend URL.

---

# 🧪 Testing Features

### ✔ Signup / Login  
### ✔ Create channel  
### ✔ Send & receive messages in real-time  
### ✔ Multiple tabs → individual presence updates  
### ✔ Infinite scroll pagination  
### ✔ Join/leave channels  
### ✔ Auto-refresh presence list  

---

# 🤝 Contributing

1. Fork project  
2. Create a new branch  
3. Submit PR 🎉  

---

# 🛡 License
MIT License – free to modify & distribute.

---

# 🙌 Author
Developed by **Prabor Kar**  
Portfolio: https://prabor.netlify.app  
GitHub: https://github.com/Praborkar  
LinkedIn: https://linkedin.com/in/prabor-kar/

---
