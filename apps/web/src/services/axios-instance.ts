import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth-store";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

interface RefreshResponse {
  accessToken: string;
}

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshState = {
  isRefreshing: false,
  failedQueue: [] as QueueItem[],
};

const processQueue = (
  error: Error | null = null,
  token: string | null = null
): void => {
  refreshState.failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshState.failedQueue = [];
};

const handleLogout = (): void => {
  useAuthStore.getState().logout();
  localStorage.removeItem("accessToken");
};

const refreshAccessToken = async (): Promise<string> => {
  const { data } = await axios.post<RefreshResponse>(
    `${BASE_API_URL}/auth/refresh`,
    {}
  );

  if (!data?.accessToken) {
    throw new Error("No access token received");
  }

  return data.accessToken;
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Prevent refresh token loops
    if (originalRequest?.url?.includes("/auth/refresh")) {
      handleLogout();
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshState.isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshState.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && typeof token === "string") {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            }
            return Promise.reject(new Error("Invalid token received"));
          })
          .catch((err) => {
            handleLogout();
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      refreshState.isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        useAuthStore.getState().setAccessToken(newToken);

        // Update authorization headers
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        refreshState.isRefreshing = false;

        return api(originalRequest);
      } catch (err) {
        processQueue(
          err instanceof Error ? err : new Error("Refresh failed"),
          null
        );
        refreshState.isRefreshing = false;
        handleLogout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
