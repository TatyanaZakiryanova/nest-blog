import { z } from 'zod';

export const updateCommentSchema = z.object({
  text: z.string().trim().min(1).max(1000).optional(),
});

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
