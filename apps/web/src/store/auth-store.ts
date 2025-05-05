"use client";
import { create } from "zustand";
import { AuthState } from "@kraft/types";
import { useEffect } from "react";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      login: (data) => {
        set({ accessToken: data.accessToken, user: data.user });
      },
      logout: () => {
        set({ accessToken: null, user: null });
      },
      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },
      setUser: (user) => {
        set({ user: user });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only store non-sensitive data
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Custom hook to sync localStorage with the store
export function useAuthSync() {
  useEffect(() => {
    // Handle token refresh events
    const handleTokenRefreshed = (event: CustomEvent) => {
      const { token } = event.detail;
      useAuthStore.getState().setAccessToken(token);
    };

    // Handle logout events
    const handleLogout = () => {
      useAuthStore.getState().logout();
    };

    // Sync initial state from localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      useAuthStore.getState().setAccessToken(token);
    }

    // Add event listeners
    window.addEventListener(
      "auth:token-refreshed",
      handleTokenRefreshed as EventListener
    );
    window.addEventListener("auth:logout", handleLogout);

    // Clean up
    return () => {
      window.removeEventListener(
        "auth:token-refreshed",
        handleTokenRefreshed as EventListener
      );
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  return null;
}
