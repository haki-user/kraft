"use client";
import { create } from "zustand";
import { AuthState } from "@kraft/types";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  login: (data) => {
    console.log("seetting the new data", data)
    set({ accessToken: data.accessToken, user: data.user });
  },
  logout: () => {
    set({ accessToken: null, user: null });
  },
  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },
}));
