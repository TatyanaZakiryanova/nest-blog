import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(50),
  email: z.string().trim().email().max(100),
  password: z.string().trim().min(5).max(100),
  avatarUrl: z.string().url().nullable().optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
