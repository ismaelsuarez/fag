FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm -w install --no-frozen-lockfile
RUN pnpm --filter api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/package.json ./package.json
COPY --from=builder /repo/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable && pnpm i --prod --ignore-scripts --no-frozen-lockfile
EXPOSE 3002
CMD ["node", "dist/main.js"]


