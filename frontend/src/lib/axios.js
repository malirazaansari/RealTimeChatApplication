import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MAIN_URL
    ? `${import.meta.env.VITE_MAIN_URL}/api`
    : "http://localhost:5001/api",
  // baseURL: `${import.meta.env.VITE_MAIN_URL}/api`,
  withCredentials: true, // To send cookies with requests
});
