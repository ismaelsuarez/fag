import { z } from 'zod';

export const productIdSchema = z.string().uuid();

export const productSchema = z.object({
  id: productIdSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  currency: z.enum(['USD', 'EUR', 'PEN', 'MXN']),
  stock: z.number().int().nonnegative(),
  active: z.boolean().default(true)
});

export type Product = z.infer<typeof productSchema>;


