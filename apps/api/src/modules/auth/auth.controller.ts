import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";
import { setRefreshTokenCookie } from "../../lib/cookies";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await AuthService.register(validatedData);
    setRefreshTokenCookie(result.refreshToken, res);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);
    setRefreshTokenCookie(result.refreshToken, res);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token found" });
      return;
    }

    const newAccessToken = await AuthService.refreshAccessToken(refreshToken);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Invalid refresh token",
    });
  }
};
