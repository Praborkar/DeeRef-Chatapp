import React from "react";
import { FiSearch, FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";

export default function ChatHeader({ channelId }) {
  return (
    <div className="px-6 py-4 border-b flex items-center justify-between 
      bg-[#1e1f22] border-[#2b2d31]"
    >

      {/* LEFT: CHANNEL INFO */}
      <div>
        <h2 className="font-semibold text-xl flex items-center gap-2 text-[#f2f3f5]">
          # {channelId}
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        </h2>

        <p className="text-sm text-[#b5bac1] mt-1 flex items-center gap-2">
          <span>3 Members Online</span>

          {/* Avatar group */}
          <div className="flex items-center -space-x-2">
            <img
              src="https://i.pravatar.cc/40?img=1"
              className="w-6 h-6 rounded-full border border-[#1e1f22]"
              alt="user"
            />
            <img
              src="https://i.pravatar.cc/40?img=2"
              className="w-6 h-6 rounded-full border border-[#1e1f22]"
              alt="user"
            />
            <img
              src="https://i.pravatar.cc/40?img=3"
              className="w-6 h-6 rounded-full border border-[#1e1f22]"
              alt="user"
            />
          </div>
        </p>
      </div>

      {/* RIGHT: ACTION BUTTONS */}
      <div className="flex items-center gap-5 text-[#b5bac1]">

        {/* Search */}
        <button className="hover:text-[#f2f3f5] transition">
          <FiSearch className="w-5 h-5" />
        </button>

        {/* Audio Call */}
        <button className="hover:text-[#f2f3f5] transition">
          <FiPhone className="w-5 h-5" />
        </button>

        {/* Video Call */}
        <button className="hover:text-[#f2f3f5] transition">
          <FiVideo className="w-6 h-6" />
        </button>

        {/* More Options */}
        <button className="hover:text-[#f2f3f5] transition">
          <FiMoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
