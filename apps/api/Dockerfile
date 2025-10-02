FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm -r install --no-frozen-lockfile
RUN pnpm --filter api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/apps/api/dist ./dist
# Install only runtime dependencies for api
COPY --from=builder /repo/apps/api/package.json ./package.json
RUN corepack enable && npm pkg delete dependencies."@shared" && npm pkg delete dependencies."@ui" && pnpm add got@11.8.6 reflect-metadata rxjs typeorm pg nestjs-pino helmet prom-client @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/swagger @nestjs/typeorm @nestjs/bullmq bullmq ioredis zod
EXPOSE 3002
CMD ["node", "dist/main.js"]


