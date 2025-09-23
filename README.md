ecom-farmacia
==============

Monorepo pnpm + Turborepo para e-commerce de farmacia.

Apps
----
- apps/api (NestJS)
- apps/storefront (Next.js App Router + TS + Tailwind)
- apps/admin (Next.js + Tailwind + shadcn/ui)

Packages
--------
- packages/shared (tipos/DTOs Zod)
- packages/ui (design system)
- packages/config (eslint, prettier, tsconfig, commitlint)

Comandos
--------
- pnpm dev (todas las apps en paralelo)
- pnpm dev:storefront | dev:admin | dev:api
- pnpm build (build monorepo)
- pnpm build:storefront | build:admin | build:api
- pnpm test (Vitest/Jest)
- pnpm lint
- pnpm typecheck

Docker
------
- apps/storefront: `docker build -f apps/storefront/Dockerfile -t ecom-farmacia/storefront .`
- apps/admin: `docker build -f apps/admin/Dockerfile -t ecom-farmacia/admin .`
- apps/api: `docker build -f apps/api/Dockerfile -t ecom-farmacia/api .`

Docker Compose
--------------
- Levantar todo: `pnpm compose:up`
- Apagar: `pnpm compose:down`

Notas
-----
- Aliases TS: `@shared`, `@ui` configurados en `tsconfig.base.json` y en cada app.
- Husky: pre-commit (lint+typecheck), commit-msg (commitlint).
- CI: `.github/workflows/ci.yml` ejecuta lint, typecheck, test, build, y docker build.

Desarrollo local
----------------
- pnpm dev: arranca todas las apps en paralelo
- pnpm dev:storefront (http://localhost:3000)
- pnpm dev:admin (http://localhost:3001)
- pnpm dev:api (http://localhost:3002)

CI
--
- GitHub Actions en `.github/workflows/ci.yml`: lint, typecheck, test, build y docker build por app.

Docker
------
- Cada app tiene su Dockerfile y .dockerignore. Ejemplo:
  - docker build -f apps/storefront/Dockerfile -t ecom-farmacia/storefront:local .


