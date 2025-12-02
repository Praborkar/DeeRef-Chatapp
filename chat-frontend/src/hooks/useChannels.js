import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../api/api";

export function useChannels() {
  const queryClient = useQueryClient();

  // GET /channels
  const channelsQuery = useQuery(["channels"], async () => {
    const { data } = await api.get("/channels");
    return data;
  });

  // CREATE NEW CHANNEL
  const createChannel = useMutation(
    async (payload) => {
      const { data } = await api.post("/channels", payload);
      return data;
    },
    {
      onSuccess: (newChannel) => {
        // Update cache safely
        queryClient.setQueryData(["channels"], (old = []) => {
          if (old.find((c) => c._id === newChannel._id)) return old;
          return [...old, newChannel];
        });

        queryClient.invalidateQueries(["channels"]);
      },
    }
  );

  const joinChannel = useMutation(
    async (channelId) => {
      const { data } = await api.post(`/channels/${channelId}/join`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["channels"]);
      },
    }
  );

  return {
    data: channelsQuery.data,
    isLoading: channelsQuery.isLoading,
    isError: channelsQuery.isError,
    error: channelsQuery.error,
    refetch: channelsQuery.refetch,

    createChannel,
    joinChannel,
  };
}
