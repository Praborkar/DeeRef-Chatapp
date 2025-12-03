import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChannelPage from "../pages/ChannelPage";
import OnlineUsersPanel from "../components/OnlineUsersPanel";
import bg from "../assets/app-bg.png";

export default function AppLayout() {
  return (
    <div
      className="
        h-screen w-screen 
        bg-cover bg-center bg-no-repeat
        overflow-hidden
      "
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dark tint + blur overlay */}
      <div
        className="
          h-full w-full 
          bg-[#1e1f22]/70
          backdrop-blur-xl
          flex
          items-center
          justify-center
        "
      >
        {/* Main Glass Container */}
        <div
          className="
            h-[96vh] w-[96vw]
            rounded-3xl 
            overflow-hidden
            grid grid-cols-12
            bg-[#1e1f22]/60
            border border-[#2b2d31]
            backdrop-blur-lg
            shadow-[0_0_40px_rgba(0,0,0,0.55)]
          "
        >

          {/* SIDEBAR */}
          <aside
            className="
              col-span-3
              bg-[#1e1f22]/80
              backdrop-blur-xl
              border-r border-[#2b2d31]
              overflow-y-auto
            "
          >
            <Sidebar />
          </aside>

          {/* MAIN CHAT */}
          <main
            className="
              col-span-6
              bg-[#2a2c31]/80
              backdrop-blur-md
              overflow-hidden
              flex flex-col
            "
          >
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
              bg-[#1e1f22]/80
              backdrop-blur-xl
              border-l border-[#2b2d31]
              overflow-y-auto
              p-4
            "
          >
            <OnlineUsersPanel />
          </aside>

        </div>
      </div>
    </div>
  );
}
