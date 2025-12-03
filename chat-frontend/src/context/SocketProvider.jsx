import React, { createContext, useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);

  // ⭐ OPTIMIZED: presence stored as object for O(1) access
  const [presence, setPresence] = useState({});
  const [ready, setReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user || !token) return;

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
      auth: { token },
      transports: ["polling", "websocket"],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 800,
      pingTimeout: 20000,
      pingInterval: 5000, // ⭐ faster for presence
    });

    socketRef.current = socket;

    socket.removeAllListeners();

    /*
    |---------------------------------------|
    | SOCKET EVENTS START                   |
    |---------------------------------------|
    */

    socket.on("connect", () => {
      console.log("⚡ Socket connected:", socket.id);
      setReady(true);
    });

    // ⭐ FAST PRESENCE UPDATE (O(1))
    socket.on("presence:update", ({ user, presence: p }) => {
      setPresence((prev) => ({
        ...prev,
        [user._id]: p,
      }));
    });

    // ⭐ Channel Created
    socket.on("channel:created", (channel) => {
      queryClient.setQueryData(["channels"], (old = []) => {
        if (!Array.isArray(old)) return [channel];
        if (old.some((c) => c._id === channel._id)) return old;
        return [...old, channel];
      });
    });

    // ⭐ Channel Updated (members updated)
    socket.on("channel:updated", (channel) => {
      queryClient.setQueryData(["channels"], (old = []) => {
        return old.map((c) => (c._id === channel._id ? channel : c));
      });
    });

    // ⭐ Channel Deleted
    socket.on("channel:deleted", (deletedChannelId) => {
      queryClient.setQueryData(["channels"], (old = []) =>
        old.filter((ch) => ch._id !== deletedChannelId)
      );

      if (location.pathname.includes(deletedChannelId)) {
        navigate("/app");
      }
    });

    /*
    |---------------------------------------|
    | SOCKET EVENTS END                     |
    |---------------------------------------|
    */

    // Cleanup
    return () => {
      console.log("🔌 Socket cleanup");
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
      socketRef.current = null;
      setReady(false);
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        presence,  // ⭐ O(1) presence map
        ready,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
