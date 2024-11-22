export interface RegisterDTO {
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
    role: string;
    organizationName?: string;
    organizationDomain?: string;
  };
  token: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}