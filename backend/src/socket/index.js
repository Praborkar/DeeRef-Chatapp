const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const Channel = require("../models/Channel");
const Presence = require("../models/Presence");
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (io) {
  const userSockets = new Map(); // userId → Set(socketIds)

  const setPresence = async (userId, isOnline) => {
    await Presence.findOneAndUpdate(
      { userId },
      { userId, isOnline, lastActive: new Date() },
      { upsert: true }
    );
  };

  const broadcastPresence = async (userId) => {
    const presence = await Presence.findOne({ userId }).lean();
    const user = await User.findById(userId).lean();

    io.emit("presence:update", {
      user: {
        _id: userId,
        name: user?.name,
        email: user?.email,
      },
      presence,
    });
  };

  io.on("connection", async (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // AUTH
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return socket.disconnect();
    }

    const userId = payload.userId;
    socket.userId = userId;

    // Track sockets per user
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);

    if (userSockets.get(userId).size === 1) {
      await setPresence(userId, true);
      await broadcastPresence(userId);
    }

    // JOIN CHANNEL
    socket.on("joinChannel", async ({ channelId }) => {
      const channel = await Channel.findById(channelId);
      if (!channel) return socket.emit("error", "Channel not found");

      socket.join(channelId);
      console.log(`📌 User ${userId} joined ${channelId}`);
    });

    // LEAVE CHANNEL
    socket.on("leaveChannel", ({ channelId }) => {
      socket.leave(channelId);
      console.log(`🚪 User left channel ${channelId}`);
    });

    // SEND MESSAGE — INSTANT (fixed structure)
    socket.on("sendMessage", async ({ channelId, text }) => {
      if (!channelId || !text) return;

      // ① Emit instantly
      const tempMsg = {
        _id: Date.now(),
        channelId,
        text,
        user: { _id: userId },  // FIXED structure
        createdAt: new Date(),
        optimistic: true,
      };

      io.to(channelId).emit("newMessage", tempMsg);

      // ② Save to DB asynchronously
      const msg = new Message({ channelId, userId, text });
      await msg.save();

      const fullMsg = await Message.findById(msg._id)
        .populate("userId", "name email")
        .lean();

      const finalMsg = {
        ...fullMsg,
        user: fullMsg.userId, // normalized
      };

      // ③ Send the final confirmed database message
      io.to(channelId).emit("message:update", finalMsg);
    });

    // HEARTBEAT
    socket.on("heartbeat", () => {
      Presence.updateOne(
        { userId },
        { lastActive: new Date() },
        { upsert: true }
      ).exec();
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      console.log("🔴 Socket disconnected:", socket.id);

      const set = userSockets.get(userId);
      set.delete(socket.id);

      if (set.size === 0) {
        userSockets.delete(userId);
        await setPresence(userId, false);
      } else {
        await setPresence(userId, true);
      }

      await broadcastPresence(userId);
    });
  });
};
