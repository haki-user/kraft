import { RegisterDTO, LoginDTO, AuthResponse } from "@kraft/types";
import { useAuthStore } from "@/store/auth-store";
import api from "./axios-instance";

export const registerUser = async (
  data: RegisterDTO
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  const authData = response.data;
  useAuthStore.getState().login(authData);
  return authData;
};

export const loginUser = async (data: LoginDTO): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  const authData = response.data;
  useAuthStore.getState().login(authData);
  localStorage.setItem("accessToken", authData.token);
  return authData;
};

export const logoutUser = () => {
  useAuthStore.getState().logout();
  localStorage.removeItem("accessToken");
};
