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
    console.log(refreshToken);
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token found" });
      return;
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    setRefreshTokenCookie(result.refreshToken, res);
    res
      .status(200)
      .json({ user: result.user, accessToken: result.accessToken });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Invalid refresh token",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const userDetails = await AuthService.getUserDetails(userId);
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
