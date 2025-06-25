import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim().min(2).max(100),
  text: z.string().trim().min(2).max(10000),
  tags: z.array(z.string().trim().min(1).max(30)).default([]),
  imageUrl: z.string().nullable().default(null),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
