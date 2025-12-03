import React from "react";
import { useSocketContext } from "../context/SocketProvider";
import defaultAvatar from "../assets/profile.png";

export default function OnlineUsersPanel() {
  const { presence } = useSocketContext();

  const onlineUsers = Object.entries(presence)
    .filter(([_, p]) => p?.isOnline)
    .map(([userId, p]) => ({
      _id: userId,
      name: p?.name || "Unknown",
      email: p?.email,
      avatarUrl: p?.avatarUrl,
    }));

  if (!onlineUsers.length) {
    return (
      <div className="text-[#8a8e93] text-xs uppercase text-center py-6">
        No users online
      </div>
    );
  }

  return (
    <div
      className="
        relative 
        h-full flex flex-col
        w-full

        bg-[#1e1f22]/60
        backdrop-blur-xl
        rounded-[28px]
        border border-[#2b2d31]/70
        shadow-[0_8px_30px_rgba(0,0,0,0.45)]
        overflow-hidden
      "
    >
      {/* Subtle glossy overlay */}
      <div
        className="
          absolute inset-0 pointer-events-none
          bg-gradient-to-b from-white/10 to-transparent
          opacity-10
        "
      />

      {/* Content */}
      <div className="px-5 py-6 z-10 overflow-y-auto">

        {/* Header */}
        <h3 className="text-[11px] font-semibold text-[#8a8e93] uppercase tracking-wide mb-4">
          Online — {onlineUsers.length}
        </h3>

        {/* List of Online Users */}
        <ul className="space-y-4">
          {onlineUsers.map((user) => (
            <li
              key={user._id}
              className="
                flex items-center gap-4 px-3 py-2
                rounded-lg cursor-pointer
                transition
                hover:bg-white/5
              "
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatarUrl || defaultAvatar}
                  alt={user.name}
                  className="
                    w-10 h-10 rounded-full object-cover
                    border border-black/30
                    shadow-[0_2px_5px_rgba(0,0,0,0.5)]
                  "
                />

                {/* Status dot */}
                <span
                  className="
                    absolute bottom-0 right-0
                    w-3 h-3 rounded-full bg-green-500
                    ring-2 ring-[#1e1f22]
                  "
                />
              </div>

              {/* Name + Status */}
              <div className="leading-tight">
                <p className="text-sm font-medium text-white">
                  {user.name}
                </p>

                <p className="text-xs text-[#8a8e93]">
                  Online
                </p>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
