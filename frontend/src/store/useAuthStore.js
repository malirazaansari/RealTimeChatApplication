import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { auth, googleProvider } from "./firebase.js"; // Import Firebase config
import { signInWithPopup } from "firebase/auth";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogginingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in CheckAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      console.log("API Response:", res);
      if (res?.data) {
        set({ authUser: res.data });
        toast.success("Account created successfully");
        get().connectSocket();
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLogginingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log("API Response:", res);
      if (res?.data) {
        set({ authUser: res.data });
        toast.success("Logged in successfully");

        get().connectSocket();
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      set({ isLogginingIn: false });
    }
  },
  signInWithGoogle: async () => {
    set({ isLogginingIn: true });
    try {
      // Firebase Google sign-in
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Optionally, send the ID token to your backend for validation or create a user
      const idToken = await user.getIdToken();
      const res = await axiosInstance.post("/auth/google-login", {
        token: idToken,
      });

      if (res?.data) {
        set({ authUser: res.data });
        toast.success("Logged in with Google successfully");
        get().connectSocket();
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      toast.error("Google Sign-In failed");
    } finally {
      set({ isLogginingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    console.log("Connecting socket with userId:", authUser._id);

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("Online users received:", userIds);
      set({ onlineUsers: userIds });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
