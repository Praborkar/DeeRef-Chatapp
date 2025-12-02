import React, { createContext, useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);

  const [presence, setPresence] = useState([]);
  const [ready, setReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user || !token) return;

    // ⭐ FIX: Allow polling + websocket for zero message delays
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
      auth: { token },
      transports: ["polling", "websocket"],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 800,
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    socketRef.current = socket;

    // --- Remove stale listeners ---
    socket.removeAllListeners();

    // --- Init events ---
    socket.on("connect", () => {
      console.log("⚡ Socket connected:", socket.id);
      setReady(true);
    });

    // --- Presence updated ---
    socket.on("presence:update", (data) => {
      setPresence((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const filtered = list.filter((item) => item.user._id !== data.user._id);
        return [...filtered, data];
      });
    });

    // --- Channel deleted from server ---
    socket.on("channel:deleted", (deletedChannelId) => {
      queryClient.setQueryData(["channels"], (old) => {
        if (!old) return old;
        return old.filter((ch) => ch._id !== deletedChannelId);
      });

      if (location.pathname.includes(deletedChannelId)) {
        navigate("/app");
      }
    });

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
    <SocketContext.Provider value={{ socket: socketRef.current, presence, ready }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
