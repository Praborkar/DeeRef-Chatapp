import { useEffect } from "react";
import { useSocketContext } from "../context/SocketProvider";


export function useSocket(onPresenceUpdate) {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    // Presence listener only
    if (onPresenceUpdate) {
      socket.off("presence:update");
      socket.on("presence:update", onPresenceUpdate);
    }

    return () => {
      if (onPresenceUpdate) {
        socket.off("presence:update", onPresenceUpdate);
      }
    };
  }, [socket, onPresenceUpdate]);

  return socket;
}
