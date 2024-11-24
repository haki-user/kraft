import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken; // Get token from Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach the token to the headers
  }
  return config;
});

// Interceptors for auth, logging, or error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", error.response || error.message);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If access token is expired, try to refresh it using refresh token
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Error refreshing token", err);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
