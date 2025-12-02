import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-600">
      {/* Spinner */}
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-gray-300 border-t-green-500"></div>

      {/* Optional label */}
      <p className="text-sm mt-3 animate-pulse">Loading...</p>
    </div>
  );
}
