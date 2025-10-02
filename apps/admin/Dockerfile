# Build Next.js app using workspace context
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /repo
COPY . .
# Ensure no local node_modules are included in context
RUN rm -rf node_modules
RUN pnpm -r install --no-frozen-lockfile --prefer-offline
RUN pnpm --filter @ui --filter @shared --filter admin build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /repo/apps/admin/.next/standalone ./
COPY --from=builder /repo/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /repo/apps/admin/public ./apps/admin/public
EXPOSE 3001
CMD ["node", "apps/admin/server.js"]


