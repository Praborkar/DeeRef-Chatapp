import React, { useState } from "react";
import { useSocketContext } from "../context/SocketProvider";
import api from "../api/api";
import { FiSmile, FiPaperclip, FiSend } from "react-icons/fi";
import { useMessages } from "../hooks/useMessages";

export default function ChatInput({ channelId }) {
  const [text, setText] = useState("");
  const { socket } = useSocketContext();
  const { addLocalMessage } = useMessages(channelId);

  async function sendMessage() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const tempMessage = {
      _id: Date.now(),
      text: trimmed,
      channelId,
      createdAt: new Date(),
      userId: { _id: "me" },
      optimistic: true,
    };

    addLocalMessage(tempMessage);

    if (socket) {
      socket.emit("sendMessage", { channelId, text: trimmed });
    } else {
      await api.post("/messages", { channelId, text: trimmed });
    }

    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="p-4 border-t border-[#2b2d31] bg-[#1e1f22]">
      <div
        className="
          flex items-center gap-3
          px-5 py-3
          rounded-2xl
          bg-[#2b2d31] 
          border border-[#3c3f41]
          shadow-[inset_0_0_12px_rgba(0,0,0,0.4)]
          relative
          transition
        "
      >
        {/* Glow top highlight */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-b from-white/5 to-transparent opacity-20" />

        {/* Emoji */}
        <button
          className="
            text-[#b5bac1] hover:text-[#f2f3f5]
            hover:scale-110 active:scale-95
            transition transform
          "
        >
          <FiSmile className="w-5 h-5" />
        </button>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="
            flex-1 bg-transparent outline-none resize-none
            text-sm text-[#f2f3f5] placeholder-[#707379]
            caret-[#5865f2]
            leading-5
          "
          placeholder="Write a message..."
        />

        {/* Attachment */}
        <button
          className="
            text-[#b5bac1] hover:text-[#f2f3f5]
            hover:scale-110 active:scale-95 
            transition transform
          "
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Send */}
        <button
          onClick={sendMessage}
          className="
            flex items-center justify-center
            bg-[#5865f2] text-white 
            w-9 h-9 rounded-xl
            hover:bg-[#4752c4]
            hover:scale-[1.05] active:scale-95
            transition transform
            shadow-[0_4px_14px_rgba(88,101,242,0.35)]
          "
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
