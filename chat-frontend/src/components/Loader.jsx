import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-[#9ca0a6] select-none">

      {/* Premium Minimal Spinner */}
      <div
        className="
          h-6 w-6 
          rounded-full 
          border-[3px]
          border-[#2b2d31] 
          border-t-[#5865f2] 
          animate-spin
        "
      />

      {/* Label */}
      <p className="text-xs mt-3 tracking-wide text-[#8b8e94]">
        Loading…
      </p>
    </div>
  );
}
