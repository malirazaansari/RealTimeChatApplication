import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { auth, googleProvider } from "./firebase.js";
import { signInWithPopup } from "firebase/auth";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogginingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isPopupOpen: false,
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
    const { isPopupOpen } = get();
    if (isPopupOpen) return;

    set({ isPopupOpen: true, isLogginingIn: true });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Firebase sign-in result:", result);

      const user = result.user;
      console.log("Firebase user details:", result.user);

      const idToken = await user.getIdToken();
      console.log("Firebase ID token:", idToken);

      const response = await axiosInstance.post("/auth/google-login", {
        token: idToken,
      });
      console.log("API Response:", response);

      if (response?.data) {
        set({ authUser: response.data });
        toast.success("Logged in with Google successfully");
        get().connectSocket();
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      toast.error("Google Sign-In failed");
    } finally {
      set({ isPopupOpen: false, isLogginingIn: false });
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
