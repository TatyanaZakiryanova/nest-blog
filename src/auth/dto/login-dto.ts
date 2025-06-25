import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().trim().min(5).max(100),
});

export type LoginDto = z.infer<typeof loginSchema>;
