import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useChannels } from "../hooks/useChannels";
import { useMutation, useQueryClient } from "react-query";
import api from "../api/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import channelIcon from "../assets/channel.png";

export default function ChannelList({ search = "" }) {
  const { data, isLoading } = useChannels();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/channels/${id}`),
    onSuccess: () => {
      toast.success("Channel deleted");
      queryClient.invalidateQueries("channels");
    },
    onError: () => toast.error("Failed to delete"),
  });

  if (isLoading) {
    return <div className="text-[#8a8e93] text-sm px-2">Loading…</div>;
  }

  const channels = Array.isArray(data) ? data : [];

  const filtered = channels
    .filter((ch) => ch.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!filtered.length) {
    return <div className="text-[#8a8e93] text-sm px-2">No channels</div>;
  }

  return (
    <>
      <ul className="space-y-1.5">
        {filtered.map((channel) => {
          const isActive = location.pathname.includes(channel._id);

          return (
            <li key={channel._id} className="relative group">
              {/* ACTIVE BAR — subtle + minimal */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#5865f2] rounded-r-md" />
              )}

              <Link
                to={`/app/channels/${channel._id}`}
                className={`
                  flex items-center gap-3
                  px-3 py-2 rounded-lg text-sm
                  transition-all duration-150 select-none

                  ${
                    isActive
                      ? "bg-[#35363b] text-white shadow-sm"
                      : "text-[#b5bac1] hover:bg-[#2d2f34] hover:text-white"
                  }
                `}
              >
                {/* ICON */}
                <div
                  className={`
                    w-7 h-7 flex items-center justify-center rounded-md
                    border transition

                    ${
                      isActive
                        ? "bg-[#1e1f22] border-[#2b2d31]"
                        : "bg-[#2b2d31] border-[#3c3f41] group-hover:border-[#4a4d52]"
                    }
                  `}
                >
                  <img src={channelIcon} className="w-4 h-4 opacity-80" />
                </div>

                {/* CHANNEL NAME */}
                <span className="flex-1 truncate font-medium">#{channel.name}</span>

                {/* UNREAD DOT */}
                {!isActive && channel.unread > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#5865f2]" />
                )}
              </Link>

              {/* DELETE BUTTON — clean + minimal */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmDelete(channel);
                }}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-[#8a8e93] hover:text-red-500
                  opacity-0 group-hover:opacity-100
                  transition duration-150
                "
              >
                <Trash2 size={16} />
              </button>
            </li>
          );
        })}
      </ul>

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#2a2b2f] border border-[#3a3c42] rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold text-white">Delete Channel</h2>

            <p className="text-[#b5bac1] text-sm mt-2">
              Delete <span className="text-white">#{confirmDelete.name}</span>?
            </p>

            <div className="flex justify-end mt-5 gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-1 rounded bg-[#333438] text-[#ccc] hover:bg-[#3c3e42]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(confirmDelete._id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
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
