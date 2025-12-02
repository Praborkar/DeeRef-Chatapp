import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChannelPage from "../pages/ChannelPage";
import OnlineUsersPanel from "../components/OnlineUsersPanel";

export default function AppLayout() {
  return (
    <div className="h-screen w-full bg-[#1e1f22] p-6 text-[#f2f3f5]">
      {/* Outer Container */}
      <div
        className="
          h-full rounded-3xl overflow-hidden
          grid grid-cols-12
          bg-[#1e1f22]
          border border-[#2b2d31]
          shadow-[0_0_20px_rgba(0,0,0,0.4)]
        "
      >

        {/* LEFT SIDEBAR */}
        <aside
          className="
            col-span-3 
            border-r border-[#2b2d31] 
            bg-[#1e1f22] 
            p-4 overflow-y-auto
          "
        >
          <Sidebar />
        </aside>

        {/* MAIN CHAT WINDOW */}
        <main className="col-span-6 bg-[#313338] flex flex-col overflow-hidden">

          <Routes>
            <Route path="channels/:channelId" element={<ChannelPage />} />

            <Route
              path="/"
              element={
                <div className="m-auto text-[#b5bac1] text-center">
                  Select a channel or create a new one.
                </div>
              }
            />
          </Routes>

        </main>

        {/* RIGHT PANEL */}
        <aside
          className="
            col-span-3
            border-l border-[#2b2d31] 
            bg-[#1e1f22] 
            p-4 overflow-y-auto
          "
        >
          <OnlineUsersPanel />
        </aside>

      </div>
    </div>
  );
}
