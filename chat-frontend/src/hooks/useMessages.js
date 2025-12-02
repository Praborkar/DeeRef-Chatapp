import { useInfiniteQuery, useQueryClient } from "react-query";
import api from "../api/api";

export function useMessages(channelId) {
  const queryClient = useQueryClient();

  // Infinite message pagination
  const messageQuery = useInfiniteQuery(
    ["messages", channelId],
    async ({ pageParam = 1 }) => {
      const res = await api.get(`/messages/${channelId}?page=${pageParam}`);
      return res.data; // { messages, page, totalPages }
    },
    {
      enabled: !!channelId,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
        return undefined;
      },
    }
  );

  // ⭐ FIX 1: Avoid duplicates when adding messages
  function addLocalMessage(message) {
    queryClient.setQueryData(["messages", channelId], (old) => {
      if (!old) {
        return {
          pages: [
            {
              messages: [message],
              page: 1,
              totalPages: 1,
            },
          ],
        };
      }

      const pages = [...old.pages];
      const lastPageIndex = pages.length - 1;
      const lastPage = pages[lastPageIndex];

      // 🚫 Prevent duplicate optimistic messages
      const alreadyExists = lastPage.messages.some(
        (m) =>
          m._id === message._id ||
          (m.text === message.text && m.optimistic && message.optimistic)
      );

      if (alreadyExists) return old;

      pages[lastPageIndex] = {
        ...lastPage,
        messages: [...lastPage.messages, message],
      };

      return { ...old, pages };
    });
  }

  // ⭐ FIX 2: Replace optimistic message, DO NOT DUPLICATE
  function updateConfirmedMessage(finalMsg) {
    queryClient.setQueryData(["messages", channelId], (old) => {
      if (!old) return old;

      const updatedPages = old.pages.map((page) => {
        return {
          ...page,
          messages: page.messages.map((msg) => {
            // Replace optimistic temp
            if (msg.optimistic) {
              return finalMsg;
            }
            return msg;
          }),
        };
      });

      return { ...old, pages: updatedPages };
    });
  }

  const refetchMessages = () => {
    queryClient.invalidateQueries(["messages", channelId]);
  };

  return {
    ...messageQuery,
    addLocalMessage,
    updateConfirmedMessage,
    refetchMessages,
  };
}
