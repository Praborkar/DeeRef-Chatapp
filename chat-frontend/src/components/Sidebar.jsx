import React, { useState, useRef, useEffect } from "react";
import ChannelList from "./ChannelList";
import CreateChannelModal from "./CreateChannelModal";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const contentRef = useRef(null);
  const innerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (innerRef.current) {
      setContentHeight(innerRef.current.scrollHeight);
    }
  }, [collapsed, search, user]);

  return (
    <div
      className="
        relative
        h-full flex flex-col 
        bg-[#1b1c20] text-[#f2f3f5]
        rounded-3xl 
        px-5 py-6 
        border-r border-[#2b2d31]/60 
        shadow-[inset_0_0_20px_rgba(0,0,0,0.55)]
        space-y-6
      "
    >
      {/* OPTIONAL VERY LIGHT TOP GRADIENT */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-b from-white/5 via-transparent to-transparent mix-blend-overlay"></div>

      {/* USER PROFILE CARD */}
      <div
        className="
          relative flex items-center justify-between
          p-3 rounded-2xl
          bg-[#2b2d31] 
          border border-[#3c3f41]
          hover:bg-[#3a3c42] transition
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              w-10 h-10 rounded-full 
              bg-[#5865f2]/20 
              text-[#5865f2] 
              flex items-center justify-center
              font-semibold text-lg
              shadow-[0_0_10px_rgba(88,101,242,0.3)]
            "
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <div className="font-semibold text-[#f2f3f5] leading-snug">
              {user?.name}
            </div>
            <div className="text-xs text-[#b5bac1]">{user?.email}</div>
          </div>
        </div>

        <button
          className="text-red-400 text-xs font-medium hover:text-red-300 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* CREATE CHANNEL BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="
          w-full py-2.5 rounded-xl text-sm font-medium 
          bg-[#5865f2] hover:bg-[#4752c4]
          active:scale-[0.98] transition
          shadow-[0_4px_14px_rgba(88,101,242,0.3)]
          text-white
        "
      >
        + Create Channel
      </button>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search channels..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full bg-[#2b2d31] border border-[#3c3f41] 
          p-2.5 rounded-xl text-sm text-[#f2f3f5]
          placeholder-[#8a8e93]
          outline-none focus:ring-2 focus:ring-[#5865f2]
          transition
        "
      />

      {/* CHANNEL HEADER */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between cursor-pointer select-none group mt-2"
      >
        <h3 className="text-[11px] font-semibold text-[#8a8e93] tracking-widest uppercase group-hover:text-[#f2f3f5] transition">
          Channels
        </h3>

        <svg
          className={`w-4 h-4 text-[#8a8e93] transform transition-transform duration-300 ${
            collapsed ? "-rotate-90" : "rotate-0"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10l5 5 5-5" />
        </svg>
      </div>

      {/* SMOOTH COLLAPSE REGION */}
      <div
        ref={contentRef}
        style={{ height: collapsed ? "0px" : `${contentHeight}px` }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div ref={innerRef} className="opacity-100 transition-opacity duration-300">
          <div className="flex-1 overflow-y-auto pr-1 space-y-1">
            <ChannelList search={search} />
          </div>
        </div>
      </div>

      {showModal && <CreateChannelModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
