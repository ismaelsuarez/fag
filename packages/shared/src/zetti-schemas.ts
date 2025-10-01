import { z } from 'zod';

// OAuth — encode credentials
export const zettiEncodeSchema = z.object({
  encode: z.string()
});
export type ZettiEncode = z.infer<typeof zettiEncodeSchema>;

// OAuth — token response (password/refresh)
export const zettiTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string().optional().nullable(),
  refresh_token: z.string().optional()
});
export type ZettiToken = z.infer<typeof zettiTokenSchema>;

// About
export const zettiAboutSchema = z.object({
  version: z.string().optional(),
  status: z.string().optional()
});
export type ZettiAbout = z.infer<typeof zettiAboutSchema>;

// User permissions by node
export const zettiPermissionsSchema = z.object({
  permissions: z.array(z.string())
});
export type ZettiPermissions = z.infer<typeof zettiPermissionsSchema>;

// Products search (group-based or by actualization date) — paged content
export const zettiProductSearchItemSchema = z.object({
  id: z.string().or(z.number()).transform(String),
  name: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  externalId: z.string().optional().nullable()
});

export const zettiPageSchema = z.object({
  content: z.array(zettiProductSearchItemSchema),
  page: z.number().optional(),
  size: z.number().optional(),
  totalPages: z.number().optional(),
  totalElements: z.number().optional()
});
export type ZettiProductSearchPage = z.infer<typeof zettiPageSchema>;

// Details per nodes — price/stock per node
export const zettiDetailsPerNodeItemSchema = z.object({
  nodeId: z.string().or(z.number()).transform(String),
  productId: z.string().or(z.number()).transform(String),
  skuId: z.string().or(z.number()).transform(String).optional().nullable(),
  price: z.number().or(z.string()).transform((v) => Number(v)).optional().nullable(),
  currency: z.string().optional().nullable(),
  stock: z.number().or(z.string()).transform((v) => Number(v)).optional().nullable(),
  stockReserved: z.number().or(z.string()).transform((v) => Number(v)).optional().nullable()
});

export const zettiDetailsPerNodesSchema = z.object({
  items: z.array(zettiDetailsPerNodeItemSchema)
});
export type ZettiDetailsPerNodes = z.infer<typeof zettiDetailsPerNodesSchema>;


