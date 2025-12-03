import React from "react";
import { FiSearch, FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";
import { useQuery } from "react-query";
import api from "../api/api";
import { useSocketContext } from "../context/SocketProvider";

export default function ChatHeader({ channelId }) {
  const { presence } = useSocketContext();

  const { data: channel, isLoading } = useQuery(
    ["channel", channelId],
    async () => {
      const res = await api.get(`/channels/${channelId}`);
      return res.data;
    },
    { enabled: !!channelId }
  );

  if (isLoading || !channel) {
    return (
      <div className="h-14 flex items-center px-6 bg-[#1e1f22] border-b border-[#2b2d31] text-[#8a8e93]">
        Loading…
      </div>
    );
  }

  const members = channel.members || [];
  const presenceArray = Object.entries(presence).map(([id, p]) => ({ _id: id, ...p }));

  const onlineMembers = members.filter((m) =>
    presenceArray.some((p) => p._id === m._id && p.isOnline)
  );

  return (
    <header
      className="
        h-14 px-6 flex items-center justify-between
        bg-[#1e1f22]
        border-b border-[#2b2d31]/70
        select-none
      "
    >
      {/* LEFT: Channel Info */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm tracking-wide">
            # {channel.name}
          </span>

          {onlineMembers.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-[3px] text-xs text-[#9ca0a6]">
          {/* Online Count */}
          <span>
            {onlineMembers.length} Online • {members.length} Members
          </span>

          {/* Divider Dot */}
          <span className="w-1 h-1 rounded-full bg-[#3a3c40]" />

          {/* Avatar Group */}
          <div className="flex items-center -space-x-2.5">
            {members.slice(0, 4).map((m) => (
              <div
                key={m._id}
                className="
                  w-5 h-5 rounded-full
                  bg-[#2e3034]
                  border border-[#1c1d1f]
                  flex items-center justify-center
                  text-[10px] text-[#c2c5ca]
                  font-medium
                "
              >
                {m.name?.[0]?.toUpperCase()}
              </div>
            ))}

            {members.length > 4 && (
              <div
                className="
                  w-5 h-5 rounded-full 
                  bg-[#2e3034]
                  border border-[#1c1d1f]
                  flex items-center justify-center
                  text-[10px] text-[#9ca0a6]
                "
              >
                +{members.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4 text-[#9ca0a6]">
        {[FiSearch, FiPhone, FiVideo, FiMoreVertical].map((Icon, i) => (
          <button
            key={i}
            className="
              p-1.5 rounded-md
              hover:bg-[#2a2c30] 
              hover:text-white
              transition-colors
            "
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </header>
  );
}
