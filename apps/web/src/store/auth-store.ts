import { create } from "zustand";
import { AuthState } from "@kraft/types";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  login: (data) => {
    set({ accessToken: data.accessToken, user: data.user });
  },
  logout: () => {
    set({ accessToken: null, user: null });
    localStorage.removeItem("accessToken");
  },
  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },
}));

const token = localStorage.getItem("accessToken");
if (token) {
  useAuthStore.getState().setAccessToken(token);
}
