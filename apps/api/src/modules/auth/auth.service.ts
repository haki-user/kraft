import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  JWTPayload,
} from "@kraft/types";
import prisma from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../../lib/jwt";

export const register = async (
  data: RegisterDTO
): Promise<AuthResponse & { refreshToken: string }> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName || undefined,
      organizationDomain: user.organizationDomain || undefined,
    },
    accessToken,
    refreshToken,
  };
};

export const login = async (
  credentials: LoginDTO
): Promise<AuthResponse & { refreshToken: string }> => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName || undefined,
      organizationDomain: user.organizationDomain || undefined,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return generateAccessToken(user);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
