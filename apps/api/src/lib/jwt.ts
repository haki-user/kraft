import jwt from "jsonwebtoken";
import { JWTPayload } from "@kraft/types";

export const generateAccessToken = (payload: JWTPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "100h" }
  );
};

export const generateRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
};
