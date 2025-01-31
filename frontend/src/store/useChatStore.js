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
    if (!userId) {
      console.error("getMessages: userId is required.");
      return;
    }

    const isFetchingMore = !!before;

    set({
      isMessagesLoading: !isFetchingMore,
      isFetchingMoreMessages: isFetchingMore,
    });

    try {
      const params = before ? { before } : {};

      const res = await axiosInstance.get(`/messages/${userId}`, { params });

      // Ensure each message has a valid status
      const updatedMessages = res.data.map((msg) => ({
        ...msg,
        status: msg.status || "delivered", // Default to "delivered" if missing
      }));

      set((state) => ({
        messages: isFetchingMore
          ? [...updatedMessages, ...state.messages]
          : updatedMessages,
        // messages: isFetchingMore ? [...res.data, ...state.messages] : res.data,
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
    const socket = useAuthStore.getState().socket;

    if (!selectedUser) {
      toast.error("No user selected for sending the message.");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
      if (socket && socket.connected) {
        socket.emit("sendMessage", {
          receiverId: selectedUser._id,
          ...messageData,
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !socket || !socket.connected) return;

    socket.off("newMessage");
    socket.off("messageRead");

    socket.on("newMessage", (newMessage) => {
      if (
        newMessage.sendId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        const updatedMessages = [...get().messages, newMessage];
        set({ messages: updatedMessages });

        if (newMessage.receiverId === useAuthStore.getState().authUser._id) {
          socket.emit("readMessage", {
            messageId: newMessage._id,
            senderId: newMessage.sendId,
          });
        }
      }
    });

    socket.on("messageRead", ({ messageId }) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === messageId ? { ...message, status: "read" } : message
        ),
      }));
    });

    socket.on("connect", () => {
      console.log("Socket reconnected. Resubscribing to messages...");
      get().subscribeToMessages();
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    get().unsubscribeFromMessages();
    set({ selectedUser });
    get().subscribeToMessages();
  },
}));
