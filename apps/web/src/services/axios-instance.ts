import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { config } from "@/utils";

const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const api: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
  timeout: 20 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
