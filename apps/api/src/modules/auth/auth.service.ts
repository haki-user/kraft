import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation Schemas
const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  organizationName: z.string().optional(),
  organizationDomain: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerUser = async (
  userData: z.infer<typeof RegisterSchema>
) => {
  // Validate input
  const validatedData = RegisterSchema.parse(userData);

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      ...validatedData,
      password: hashedPassword,
    },
  });

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "1d" }
  );

  return { user, token };
};

export const loginUser = async (credentials: z.infer<typeof LoginSchema>) => {
  // Validate input
  const validatedData = LoginSchema.parse(credentials);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const isMatch = await bcrypt.compare(validatedData.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "1d" }
  );

  return { user, token };
};
