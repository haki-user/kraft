import { Response } from "express";

export const setRefreshTokenCookie = (refreshToken: string, res: Response) => {
  const oneDay = 24 * 60 * 60 * 1000;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === "production", // Set to true in production to enable HTTPS
    sameSite: "strict", // CSRF protection
    maxAge: oneDay * 7,
  });
};
