import axios from "axios";

const baseURLs = {
  "localhost": "http://localhost:5001/api",
  "realtimechatapplication-production.up.railway.app":
    "https://realtimechatapplication-production.up.railway.app/api",
};

const currentHost = window.location.hostname;
const selectedBaseURL =
  baseURLs[currentHost] ||
  "https://realtimechatapplication-production.up.railway.app/api";

export const axiosInstance = axios.create({
  baseURL: selectedBaseURL,
  // baseURL:
  //   import.meta.env.MODE === "development"
  //     ? "http://localhost:5001/api"
  //     : "/api",
  // baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`,
  withCredentials: true,
});
