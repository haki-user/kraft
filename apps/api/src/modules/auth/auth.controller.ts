import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await AuthService.registerUser(req.body);
    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
      errors: error.errors,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await AuthService.loginUser(req.body);
    res.json({ user, token });
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};
