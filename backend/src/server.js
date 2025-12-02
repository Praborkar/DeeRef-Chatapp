require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const channelsRoutes = require('./routes/channels');
const messagesRoutes = require('./routes/messages');

const socketHandler = require('./socket');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

// Connect DB
connectDB(MONGO_URI);

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// === Socket.IO Setup ===
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  transports: ["websocket"], // ⭐ Forces real WebSocket (no long-polling)
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// === Routes ===
app.use('/auth', authRoutes);
app.use('/channels', channelsRoutes);
app.use('/messages', messagesRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// === SOCKET HANDLER ===
socketHandler(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
