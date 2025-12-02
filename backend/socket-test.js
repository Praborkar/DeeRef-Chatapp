const { io } = require("socket.io-client");

// Your JWT token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTJkZjdmOGYzYzkwNDJkZWU3OTQwMWMiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzY0NjIwMjgwLCJleHAiOjE3NjUyMjUwODB9.W63HWpEUjwlLtmC6CUfAyTDlUhouaRd5yGLY4G30p2Q";

const channelId = "692df9eaf3c9042dee79401f";

// ⭐ MUST USE WEBSOCKET ONLY
const socket = io("http://localhost:4000", {
  auth: { token },
  transports: ["websocket"],  // ⭐ Fixes xhr-poll-error
  upgrade: false,             // ⭐ Prevent polling → websocket upgrade
  reconnection: true,
  reconnectionAttempts: 5,
});

// When connected
socket.on("connect", () => {
  console.log("🔗 Connected to Socket.IO:", socket.id);

  // Join channel
  socket.emit("joinChannel", { channelId });
  console.log("📌 Joined channel:", channelId);

  // Send a test message
  socket.emit("sendMessage", {
    channelId,
    text: "Hello from Socket.IO test!"
  });
});

// Receive new messages
socket.on("newMessage", (msg) => {
  console.log("💬 New Message Received:", msg);
});

// Confirmed DB-saved message
socket.on("message:update", (msg) => {
  console.log("✔ Confirmed Message (DB):", msg);
});

// Errors
socket.on("connect_error", (err) => {
  console.log("❌ Connection error:", err.message);
});
