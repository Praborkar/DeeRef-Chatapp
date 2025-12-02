import React from "react";
import { format } from "date-fns";
import defaultAvatar from "../assets/profile.png"; // <-- LOCAL IMAGE HERE

export default function MessageItem({ message, currentUserId }) {

  // Normalize user object (fixes undefined issues)
  const user = message.user || message.userId || {};

  const avatarSrc = user.avatarUrl || defaultAvatar;

  const isMe = user._id === currentUserId;

  const time = message?.createdAt
    ? format(new Date(message.createdAt), "hh:mm a")
    : "";

  return (
    <div
      className={`flex items-end gap-3 mb-5 transition-all ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >

      {/* Avatar (others) */}
      {!isMe && (
        <img
          src={avatarSrc}
          alt="avatar"
          className="
            w-9 h-9 rounded-full object-cover
            border border-[#2b2d31]
            shadow-[0_2px_6px_rgba(0,0,0,0.5)]
          "
        />
      )}

      {/* Message content */}
      <div className="max-w-[70%] flex flex-col group">

        {/* Username (others) */}
        {!isMe && (
          <div className="text-xs text-[#b5bac1] font-medium mb-1">
            {user.name || "User"}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`
            py-2.5 px-4 rounded-2xl text-[0.95rem] leading-relaxed break-words
            transition-all duration-200 group-hover:brightness-110 shadow-md

            ${
              isMe
                ? "bg-gradient-to-br from-[#5865f2] to-[#4752c4] text-white rounded-br-none shadow-[0_0_12px_rgba(88,101,242,0.4)]"
                : "bg-[#2b2d31] text-[#f2f3f5] rounded-bl-none border border-[#3c3f41]"
            }
          `}
        >
          {message.text}
        </div>

        {/* Timestamp */}
        <span
          className={`text-[10px] mt-1 opacity-70 ${
            isMe ? "self-end" : "self-start"
          } text-[#8a8e93]`}
        >
          {time}
        </span>
      </div>

      {/* Avatar (me) */}
      {isMe && (
        <img
          src={avatarSrc}
          alt="my avatar"
          className="
            w-9 h-9 rounded-full object-cover
            border border-[#4752c4]
            shadow-[0_0_10px_rgba(88,101,242,0.5)]
          "
        />
      )}
    </div>
  );
}
