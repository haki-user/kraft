import { RegisterDTO, LoginDTO, AuthResponse } from "@kraft/types";
import { useAuthStore } from "@/store/auth-store";
import api from "./axios-instance";

export const registerUser = async (
  data: RegisterDTO
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  const authData = response.data;
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem("accessToken", authData.accessToken);
  }
  
  useAuthStore.getState().login(authData);
  return authData;
};

export const loginUser = async (data: LoginDTO): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  const authData = response.data;
  
  // Store token in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem("accessToken", authData.accessToken);
  }
  
  useAuthStore.getState().login(authData);
  return authData;
};

export const verifyToken = async (): Promise<void> => {
  try {
    // Check if we have a token first
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token available");
    }
    
    const response = await api.post("/auth/verify-token");
    const user = response.data;
    useAuthStore.getState().setUser(user);
  } catch (err) {
    console.error("Error verifying token:", err);
    await logoutUser();
  }
};

export const logoutUser = async () => {
  try {
    // Try to notify the server about logout
    await api.post("/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Always clean up local state
    if (typeof window !== 'undefined') {
      localStorage.removeItem("accessToken");
    }
    useAuthStore.getState().logout();
    
    // Dispatch logout event to trigger redirect
    window.dispatchEvent(new Event('auth:logout'));
  }
};










// import { RegisterDTO, LoginDTO, AuthResponse } from "@kraft/types";
// import { useAuthStore } from "@/store/auth-store";
// import api from "./axios-instance";

// let ct = 0;

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const registerUser = async (
//   data: RegisterDTO
// ): Promise<AuthResponse> => {
//   const response = await api.post("/auth/register", data);
//   const authData = response.data;
//   useAuthStore.getState().login(authData);
//   return authData;
// };

// export const loginUser = async (data: LoginDTO): Promise<AuthResponse> => {
//   const response = await api.post("/auth/login", data);
//   const authData = response.data;
//   useAuthStore.getState().login(authData);
//   localStorage.setItem("accessToken", authData.token);
//   return authData;
// };

// export const verifyToken = async (): Promise<void> => {
//   console.log("verifying...", ct++);
//   try {
//     const response = await api.post(
//       `${API_BASE_URL}/auth/verify-token`

//       // {},
//       // {
//       //   headers: {
//       //     // "Skip-Interceptor": "true",
//       //     "Content-Type": "application/json",
//       //   },
//       // }
//     );
//     const user = response.data;
//     console.log("new data", user);
//     useAuthStore.getState().setUser(user);
//   } catch (err) {
//     console.log("error verifying...", ct++);
//     await logoutUser();
//     console.log(err);
//   }
// };

// export const logoutUser = async () => {
//   console.log("logging out...", ct++);
//   // await api.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
//   useAuthStore.getState().logout();
//   localStorage.removeItem("accessToken");
// };



