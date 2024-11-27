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
): Promise<AuthResponse & { refreshToken: string }> => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationName: user.organizationName || undefined,
        organizationDomain: user.organizationDomain || undefined,
      },
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const getUserDetails = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      organizationName: true,
      organizationDomain: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
