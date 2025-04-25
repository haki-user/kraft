import jwt from "jsonwebtoken";
import { JWTPayload } from "@kraft/types";
import { config } from "./config";

export const generateAccessToken = (payload: JWTPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );
};
