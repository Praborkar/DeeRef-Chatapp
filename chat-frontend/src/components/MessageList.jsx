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
  const bottomRef = useRef(null);

  // Flatten messages
  const messages = (pages || [])
    .flatMap((page) => page.messages || []);

  // Reverse messages for chat-style ordering
  const reversed = [...messages].reverse();

  // Detect if user is at bottom (for auto-scroll)
  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return false;

    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // Load older messages when scrolling UP
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    if (el.scrollTop < 50 && hasMore && !loadingMore) {
      const prevHeight = el.scrollHeight;

      loadMore();

      // Maintain scroll position after loading older msgs
      setTimeout(() => {
        const newHeight = el.scrollHeight;
        el.scrollTop = newHeight - prevHeight;
      }, 50);
    }
  }, [hasMore, loadingMore, loadMore]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isNearBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Helper: check if a date separator is needed
  const needsDateSeparator = (current, previous) => {
    if (!previous) return true;
    return !isSameDay(
      new Date(current.createdAt),
      new Date(previous.createdAt)
    );
  };

  // Date labels
  const formatDateLabel = (date) => {
    const d = new Date(date);
    const today = new Date();

    if (isSameDay(d, today)) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(d, yesterday)) return "Yesterday";

    return format(d, "dd MMM yyyy");
  };

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#b5bac1] text-sm bg-[#313338]">
        Start a conversation…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="
        flex-1 overflow-y-auto px-6 py-5 space-y-4
        scroll-smooth bg-[#313338] text-[#f2f3f5]
        flex flex-col
      "
    >
      {/* Loading Older Messages */}
      {loadingMore && (
        <div className="text-center text-xs text-[#8a8e93] mb-2 animate-pulse">
          Loading older messages…
        </div>
      )}

      {/* Render reversed messages */}
      {reversed.map((msg, index) => {
        const prev = reversed[index - 1];
        const showDate = needsDateSeparator(msg, prev);

        return (
          <div key={msg._id} className="animate-fadeIn">
            {/* DATE SEPARATOR */}
            {showDate && (
              <div className="flex items-center justify-center my-3">
                <span
                  className="
                    text-[11px] text-[#8a8e93] px-3 py-1 
                    bg-[#2b2d31] border border-[#3c3f41]
                    rounded-full
                  "
                >
                  {formatDateLabel(msg.createdAt)}
                </span>
              </div>
            )}

            {/* MESSAGE */}
            <MessageItem
              message={msg}
              currentUserId={currentUserId}
            />
          </div>
        );
      })}

      {/* Auto-scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
