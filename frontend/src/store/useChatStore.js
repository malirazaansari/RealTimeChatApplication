import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

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
    const isFetchingMore = !!before;

    set((state) => ({
      isMessagesLoading: !isFetchingMore,
      isFetchingMoreMessages: isFetchingMore,
    }));

    try {
      const params = before ? { before } : {};
      const res = await axiosInstance.get(`/messages/${userId}`, { params });

      set((state) => ({
        messages: isFetchingMore ? [...res.data, ...state.messages] : res.data,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch messages";
      toast.error(errorMessage);
      console.error("Error fetching messages:", error);

      set({ fetchMessagesError: errorMessage });
    } finally {
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

    if (!socket || !socket.connected) return;

    socket.on("newMessage", (newMessage) => {
      console.log("Received new message:", newMessage);
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
