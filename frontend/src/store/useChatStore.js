import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useauthstore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId, { before } = {}) => {
    // `before` can be a timestamp or message ID to fetch older messages
    const isFetchingMore = !!before; // Check if it's a fetch-more request

    // Set loading state for initial fetch or older messages
    set((state) => ({
      isMessagesLoading: !isFetchingMore,
      isFetchingMoreMessages: isFetchingMore,
    }));

    try {
      // Construct query parameters
      const params = before ? { before } : {};
      const res = await axiosInstance.get(`/messages/${userId}`, { params });

      set((state) => ({
        messages: isFetchingMore
          ? [...res.data, ...state.messages] // Prepend older messages
          : res.data, // Replace messages for initial fetch
      }));
    } catch (error) {
      // Graceful error handling with an error state
      const errorMessage =
        error.response?.data?.message || "Failed to fetch messages";
      toast.error(errorMessage);
      console.error("Error fetching messages:", error);

      // Optionally set an error state for the UI
      set({ fetchMessagesError: errorMessage });
    } finally {
      // Reset loading states
      set({
        isMessagesLoading: false,
        isFetchingMoreMessages: false,
      });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
