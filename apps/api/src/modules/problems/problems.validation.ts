import { z } from "zod";

export const idSchema = z.object({
  id: z.string().uuid("Invalid ID format."),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive integer.")
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer.")
    .optional(),
});
