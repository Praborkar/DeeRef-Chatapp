import React from "react";
import { format } from "date-fns";
import defaultAvatar from "../assets/profile.png";

export default function MessageItem({ message, currentUserId, grouped }) {
  const user = message.user || message.userId || {};
  const avatarSrc = user.avatarUrl || defaultAvatar;

  const isMe = user._id === currentUserId;

  const time = message.createdAt
    ? format(new Date(message.createdAt), "hh:mm a")
    : "";

  return (
    <div
      className={`
        group relative flex gap-3 px-4
        transition-all
        ${grouped ? "py-1" : "py-2 hover:bg-white/5"}
      `}
    >
      {/* Avatar (hidden for grouped messages) */}
      {!grouped && (
        <img
          src={avatarSrc}
          alt="avatar"
          className="
            w-9 h-9 rounded-full object-cover
            border border-[#1e1f22]
            shadow-[0_2px_6px_rgba(0,0,0,0.35)]
            mt-1
          "
        />
      )}

      {/* Message Block */}
      <div className="flex flex-col min-w-0">

        {/* NAME + TIMESTAMP (hidden for grouped messages) */}
        {!grouped && (
          <div className="flex items-center gap-2 mb-[2px]">
            <span className="text-sm font-semibold text-white">
              {user.name || "User"}
            </span>

            <span className="text-[11px] text-[#8a8e93]">
              {time}
            </span>
          </div>
        )}

        {/* MESSAGE TEXT */}
        <p
          className={`
            text-sm leading-5 whitespace-pre-wrap break-words
            transition-colors
            text-[#c7c9cb] group-hover:text-[#e3e3e3]
            ${grouped ? "ml-[44px]" : ""}
          `}
        >
          {message.text}
        </p>

      </div>
    </div>
  );
}
