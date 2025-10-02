# Build Next.js app using workspace context
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /repo
COPY . .
# Ensure no local node_modules are included in context
RUN rm -rf node_modules
RUN pnpm -r install --no-frozen-lockfile --prefer-offline
RUN pnpm --filter @ui --filter @shared --filter storefront build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /repo/apps/storefront/.next/standalone ./
COPY --from=builder /repo/apps/storefront/.next/static ./.next/static
COPY --from=builder /repo/apps/storefront/public ./public
EXPOSE 3000
CMD ["node", "server.js"]


