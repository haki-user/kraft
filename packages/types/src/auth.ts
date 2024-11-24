export type UserRole = "ADMIN" | "ORGANIZER" | "PARTICIPANT";

export interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    organizationName?: string;
    organizationDomain?: string;
  } | null;
  accessToken: string | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  name: string;
  organizationName?: string;
  organizationDomain?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    organizationName?: string;
    organizationDomain?: string;
  };
  accessToken: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}
