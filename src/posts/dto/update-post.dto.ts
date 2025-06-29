import { z } from 'zod';

export const updatePostSchema = z.object({
  title: z.string().trim().min(2).max(100).optional(),
  text: z.string().trim().min(2).max(10000).optional(),
  tags: z.array(z.string().trim().min(1).max(30)).optional(),
  imageUrl: z.string().nullable().optional(),
});

export type UpdatePostDto = z.infer<typeof updatePostSchema>;
