import React, { useState } from "react";
import ChannelList from "./ChannelList";
import CreateChannelModal from "./CreateChannelModal";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div
      className="
        h-full w-full flex flex-col
        bg-[#1e1f22]/80 
        backdrop-blur-xl
        text-[#f2f3f5]
      "
    >
      {/* HEADER */}
      <div
        className="
          px-5 py-4
          border-b border-[#2b2d31]/60
          flex items-center justify-between
        "
      >
        <h2 className="text-lg font-semibold tracking-wide">Channels</h2>
      </div>

      {/* CREATE CHANNEL BUTTON */}
      <div className="px-4 py-4">
        <button
          onClick={() => setShowModal(true)}
          className="
            w-full py-2.5 rounded-lg
            bg-[#5865f2] hover:bg-[#4752c4]
            text-white font-medium
            transition shadow-[0_4px_12px_rgba(88,101,242,0.35)]
            active:scale-95
          "
        >
          + Create Channel
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="px-4">
        <input
          type="text"
          placeholder="Search channels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full px-3 py-2
            rounded-lg text-sm
            bg-[#111214]/70
            border border-[#2b2d31]
            placeholder-[#8a8e93]
            focus:ring-2 focus:ring-[#5865f2]
            outline-none transition
          "
        />
      </div>

      {/* CHANNELS TITLE */}
      <h3
        className="
          px-4 mt-4 mb-2
          text-[11px] uppercase tracking-wider
          font-semibold text-[#8a8e93]
        "
      >
        Text Channels
      </h3>

      {/* CHANNEL LIST */}
      <div
        className="
          flex-1 overflow-y-auto 
          px-2 pb-4
          scrollbar-thin scrollbar-thumb-[#2b2d31] scrollbar-track-transparent
        "
      >
        <ChannelList search={search} />
      </div>

      {/* USER FOOTER */}
      <div
        className="
          px-4 py-4
          bg-[#111214]/70
          border-t border-[#2b2d31]/70
          flex items-center justify-between
        "
      >
        {/* Avatar + Status + Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div
              className="
                w-10 h-10 rounded-full
                bg-gradient-to-br from-[#3a3c43] to-[#1e1f22]
                flex items-center justify-center
                font-semibold text-sm text-white
                border border-[#2b2d31]
                shadow-[0_3px_8px_rgba(0,0,0,0.5)]
              "
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>

            {/* Status dot */}
            <span
              className="
                absolute bottom-0 right-0
                w-3.5 h-3.5 rounded-full
                bg-green-500 
                ring-2 ring-[#111214]
                shadow-[0_0_6px_rgba(0,255,0,0.7)]
              "
            />
          </div>

          {/* User info */}
          <div className="leading-tight">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-[11px] text-[#8a8e93]">{user?.email}</p>
          </div>
        </div>

        {/* LOGOUT BUTTON (RED) */}
        <button
          onClick={logout}
          className="
            px-4 py-1.5
            bg-red-500 
            text-white text-[12px] font-medium
            rounded-md
            hover:bg-red-600 
            active:scale-95
            transition-all
            shadow-[0_2px_6px_rgba(255,0,0,0.4)]
          "
        >
          Logout
        </button>
      </div>

      {/* MODAL */}
      {showModal && <CreateChannelModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
