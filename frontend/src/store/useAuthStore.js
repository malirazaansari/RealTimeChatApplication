import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogginingIn: false,
  isUpdatingProfile: false,
  onlineUser: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
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
      console.log("API Response:", res); // Debugging log
      if (res?.data) {
        set({ authUser: res.data });
        toast.success("Account created successfully");
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Signup Error:", error); // Log full error for debugging
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
      console.log("API Response:", res); // Debugging log
      if (res?.data) {
        set({ authUser: res.data });
        toast.success("Logged in successfully");
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Login Error:", error); // Log full error for debugging
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      set({ isLogginingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
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
}));
