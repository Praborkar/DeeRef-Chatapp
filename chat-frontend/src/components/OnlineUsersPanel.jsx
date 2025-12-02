import React from "react";
import { useSocketContext } from "../context/SocketProvider";
import defaultAvatar from "../assets/profile.png"; // <-- your local image

export default function OnlineUsersPanel() {
  const { presence } = useSocketContext();

  if (!presence || presence.length === 0) {
    return (
      <div className="text-[#8a8e93] text-sm text-center py-10 bg-[#1e1f22]">
        No users online
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#f2f3f5]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-[#b5bac1] uppercase">
          Online — {presence.length}
        </h3>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2b2d31]"></div>

      {/* List */}
      <ul className="space-y-3">
        {presence.map((user) => (
          <li
            key={user.id}
            className="
              flex items-center gap-3
              p-3 rounded-xl
              bg-[#1e1f22]
              border border-[#2b2d31]
              shadow-[0_2px_8px_rgba(0,0,0,0.25)]
              transition-all
              hover:bg-[#2b2d31] hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)]
              cursor-pointer
            "
          >
            {/* Avatar container with online badge */}
            <div className="relative">
              <img
                src={user.avatarUrl || defaultAvatar}
                alt="User avatar"
                className="
                  w-10 h-10 rounded-full object-cover
                  border border-[#2b2d31]
                  shadow-[0_0_6px_rgba(0,0,0,0.6)]
                "
              />

              {/* Green online badge */}
              <span
                className="
                  absolute bottom-0 right-0 
                  w-3 h-3 rounded-full 
                  bg-green-500 ring-2 ring-[#1e1f22]
                "
              ></span>
            </div>

            {/* User Details */}
            <div className="flex flex-col leading-tight">
              <span className="text-sm text-[#f2f3f5] font-medium">
                {user.name}
              </span>

              <span className="text-xs text-[#8a8e93]">
                Online
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
