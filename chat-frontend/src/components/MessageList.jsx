import React, { useEffect, useRef, useCallback } from "react";
import MessageItem from "./MessageItem";
import { format, isSameDay } from "date-fns";

export default function MessageList({
  pages,
  loadMore,
  hasMore,
  loadingMore,
  currentUserId,
}) {
  const containerRef = useRef(null);
  const topRef = useRef(null);

  const handleScroll = useCallback(
    (e) => {
      const el = e.target;
      if (el.scrollTop === 0 && hasMore && !loadingMore) {
        loadMore();
      }
    },
    [hasMore, loadingMore, loadMore]
  );

  const messages = (pages || []).flatMap((page) => page.messages || []);

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#b5bac1] text-sm bg-[#313338]">
        Start a conversation...
      </div>
    );
  }

  // Helper: check if a date separator is needed
  const needsDateSeparator = (current, previous) => {
    if (!previous) return true;
    return !isSameDay(new Date(current.createdAt), new Date(previous.createdAt));
  };

  // Format date separator text (Today, Yesterday, etc.)
  const formatDateLabel = (date) => {
    const d = new Date(date);
    const today = new Date();

    if (isSameDay(d, today)) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(d, yesterday)) return "Yesterday";

    return format(d, "dd MMM yyyy");
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="
        flex-1 overflow-y-auto px-6 py-5 space-y-4
        scroll-smooth bg-[#313338] text-[#f2f3f5]
        relative
      "
    >
      {/* Soft top fade effect */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#313338] to-transparent pointer-events-none" />

      {/* Infinite scroll anchor */}
      <div ref={topRef} />

      {/* Loading older messages */}
      {hasMore && (
        <div className="text-center text-xs text-[#8a8e93] mb-2 animate-pulse">
          Loading older messages...
        </div>
      )}

      {/* Message Timeline */}
      {messages.map((msg, index) => {
        const prev = messages[index - 1];
        const showDate = needsDateSeparator(msg, prev);

        return (
          <div key={msg.id || msg._id} className="animate-fadeIn">

            {/* DATE SEPARATOR */}
            {showDate && (
              <div className="flex items-center justify-center my-3">
                <span className="
                  text-[11px] text-[#8a8e93] px-3 py-1 
                  bg-[#2b2d31] border border-[#3c3f41]
                  rounded-full
                ">
                  {formatDateLabel(msg.createdAt)}
                </span>
              </div>
            )}

            {/* MESSAGE ITEM */}
            <MessageItem
              message={msg}
              currentUserId={currentUserId}
              previousMessage={prev}
            />
          </div>
        );
      })}
    </div>
  );
}
