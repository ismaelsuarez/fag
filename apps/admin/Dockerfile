# Build Next.js app using workspace context
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm -w install --no-frozen-lockfile
RUN pnpm --filter admin build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /repo/apps/admin/.next/standalone ./
COPY --from=builder /repo/apps/admin/.next/static ./.next/static
COPY --from=builder /repo/apps/admin/public ./public
EXPOSE 3001
CMD ["node", "server.js"]


