import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { useMessages } from "../hooks/useMessages";
import { useSocketContext } from "../context/SocketProvider";

export default function ChannelPage() {
  const { channelId } = useParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    addLocalMessage,
    updateConfirmedMessage,
  } = useMessages(channelId);

  const { socket, ready } = useSocketContext();

  useEffect(() => {
    if (!socket || !ready || !channelId) return;

    socket.emit("joinChannel", { channelId });

    const handleNewMessage = (msg) => {
      if (msg.optimistic) return;
      if (msg.channelId === channelId) addLocalMessage(msg);
    };

    const handleUpdatedMessage = (msg) => {
      if (msg.channelId === channelId) updateConfirmedMessage(msg);
    };

    socket.off("newMessage");
    socket.off("message:update");

    socket.on("newMessage", handleNewMessage);
    socket.on("message:update", handleUpdatedMessage);

    return () => {
      socket.emit("leaveChannel", { channelId });
      socket.off("newMessage");
      socket.off("message:update");
    };
  }, [socket, ready, channelId]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] text-[#f2f3f5]">

      {/* Chat Header */}
      <ChatHeader channelId={channelId} />

      {/* Entire chat container */}
      <div
        className="
          flex-1 overflow-hidden 
          border border-[#2b2d31] 
          rounded-lg mt-2 
          flex flex-col 
          bg-[#313338]
        "
      >
        {/* Message List */}
        <MessageList
          pages={data?.pages}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loadingMore={isFetchingNextPage}
          currentUserId={data?.currentUserId}
        />

        {/* Chat Input */}
        <ChatInput channelId={channelId} />
      </div>
    </div>
  );
}
