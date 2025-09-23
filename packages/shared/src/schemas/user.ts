import { z } from 'zod';

export const userIdSchema = z.string().uuid();

export const userSchema = z.object({
  id: userIdSchema,
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'customer'])
});

export type User = z.infer<typeof userSchema>;


