import { RegisterDTO, LoginDTO, AuthResponse } from "@kraft/types";
import { useAuthStore } from "@/store/auth-store";
import api from "./axios-instance";

let ct = 0;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export const verifyToken = async (): Promise<void> => {
  console.log("verifying...", ct++)
  try {
    const response = await api.post(
      `${API_BASE_URL}/auth/refresh`,

      {},
      {
        headers: {
          "Skip-Interceptor": "true",
          "Content-Type": "application/json",
        },
      }
    );
    const authData = response.data;
    useAuthStore.getState().login(authData);
  } catch (err) {
  console.log("error verifying...", ct++)
    await logoutUser();
    console.log(err);
  }
};

export const logoutUser = async () => {
  console.log("logging out...", ct++)
  await api.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  useAuthStore.getState().logout();
  localStorage.removeItem("accessToken");
};
