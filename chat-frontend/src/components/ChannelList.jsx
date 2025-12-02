import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useChannels } from "../hooks/useChannels";
import { useMutation, useQueryClient } from "react-query";
import api from "../api/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ChannelList({ search = "" }) {
  const { data, isLoading } = useChannels();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/channels/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["channels"]);
      toast.success("Channel deleted successfully", { style: { color: "#fff" } });
    },
    onError: () => {
      toast.error("Failed to delete channel");
    },
  });

  if (isLoading) {
    return <div className="text-[#8a8e93] text-sm p-2">Loading channels...</div>;
  }

  const channels = Array.isArray(data) ? data : [];
  const filtered = channels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!filtered.length) {
    return <div className="text-[#8a8e93] text-sm p-2">No channels found.</div>;
  }

  return (
    <>
      <ul className="space-y-1">
        {filtered.map((channel) => {
          const isActive = location.pathname.includes(channel._id);

          return (
            <li key={channel._id} className="relative group">

              {/* LEFT ACTIVE BAR — Discord Sidebar Style */}
              {isActive && (
                <div className="
                  absolute left-0 top-1/2 -translate-y-1/2 
                  w-[4px] h-6 
                  bg-[#5865f2] rounded-r-xl
                " />
              )}

              {/* CHANNEL ROW */}
              <Link
                to={`/app/channels/${channel._id}`}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl 
                  text-sm transition-all duration-200 select-none relative

                  ${isActive
                    ? "bg-[#5865f2]/20 text-[#f2f3f5] border border-[#5865f2]/30 shadow-inner"
                    : "text-[#b5bac1] hover:bg-[#2f3136] hover:text-[#f2f3f5]"
                  }
                `}
              >
                {/* ICON */}
                <span
                  className={`
                    text-lg transition-colors
                    ${isActive ? "text-[#5865f2]" : "text-[#8a8e93]"}
                  `}
                >
                  {channel.icon || "💬"}
                </span>

                {/* NAME */}
                <span className="flex-1 truncate font-medium">
                  {channel.name}
                </span>

                {/* UNREAD DOT */}
                {!isActive && channel.unread > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#5865f2]"></span>
                )}
              </Link>

              {/* DELETE BUTTON */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmDelete(channel);
                }}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-[#8a8e93] hover:text-red-500
                  opacity-0 translate-x-3 
                  group-hover:opacity-100 group-hover:translate-x-0
                  transition-all duration-300 ease-out
                  p-1 rounded
                "
              >
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </li>
          );
        })}
      </ul>

      {/* DELETE CONFIRMATION MODAL — Discord Dark */}
      {confirmDelete && (
        <div className="
          fixed inset-0 z-50 
          bg-black/60 backdrop-blur-md 
          flex items-center justify-center
        ">
          <div className="
            bg-[#2b2d31] border border-[#3c3f41] 
            rounded-xl shadow-2xl 
            p-6 w-80 text-[#f2f3f5]
          ">
            <h2 className="text-lg font-semibold">Delete Channel</h2>

            <p className="text-[#b5bac1] text-sm mt-2">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                {confirmDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="
                  px-4 py-1 text-[#b5bac1] 
                  hover:bg-[#3a3c42] transition rounded
                "
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>

              <button
                className="
                  px-4 py-1 bg-red-500 text-white rounded 
                  hover:bg-red-600 transition
                "
                onClick={() => {
                  deleteMutation.mutate(confirmDelete._id);
                  setConfirmDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
