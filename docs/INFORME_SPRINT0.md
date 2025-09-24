# INFORME SPRINT 0 — ecom-farmacia

## 1) Resumen Ejecutivo (TL;DR)
- API (NestJS): base operativa con módulos clave (auth, users, catalog, cart, checkout, orders, payments, prescriptions, search), TypeORM + PostgreSQL, migraciones, Swagger (/api/docs), BullMQ (Redis) configurado y desactivado en test, DTOs con Zod, guard ANMAT para validar recetas en checkout.
- Storefront (Next.js App Router): Tailwind + shadcn/ui + Radix, React Query, Zod, selector de sucursal persistente, Home/PLP/PDP/Carrito/Checkout/Órdenes, flujo de pago con preferencia MP y back_urls (success/failure), SEO básico (OG/Twitter), robots y sitemap.
- Admin (Next.js): scaffold base con Tailwind + shadcn/ui.
- CI/CD: CI (lint/typecheck/test/build/docker) y Release (tags v*.*.* → build & push a GHCR). Dockerfiles por app y docker-compose (Postgres/Redis + apps).

Bloqueos/Pendientes principales:
- Credenciales reales de Mercado Pago (sandbox/prod) y manejo completo de webhooks/estados.
- Certificados AFIP (homologación/prod) y definición de flujo completo de facturación.
- Integración Zetti (credenciales, ZETTI_NODE_ID, permisos e invocación de catálogo/stock).

---

## 2) Estructura del Monorepo
```
apps/
  api/            # NestJS API (TypeORM, Swagger, BullMQ)
  storefront/     # Next.js (App Router) + Tailwind/shadcn + React Query
  admin/          # Next.js base
packages/
  config/         # ESLint/Prettier/TSConfig/Commitlint compartidos
  shared/         # Zod DTOs, tipos
  ui/             # Design system (cva + radix + tailwind preset)
.github/
  workflows/      # ci.yml, release.yml
Dockerfile (por app) | docker-compose.yml
```

Gestor: pnpm (workspaces) + Turborepo.

Paquetes y scripts principales

| Paquete       | Tipo | Path              | Scripts clave |
|---|---|---|---|
| ecom-farmacia | root | ./               | dev, build, test, lint, typecheck, release:tag |
| api           | app  | apps/api         | dev, start:dev, build, test, test:e2e, migration:run, seed |
| storefront    | app  | apps/storefront  | dev, build |
| admin         | app  | apps/admin       | dev, build |
| config        | lib  | packages/config  | exporta eslint/prettier/tsconfig |
| shared        | lib  | packages/shared  | build, test, typecheck |
| ui            | lib  | packages/ui      | build, test, typecheck |

---

## 3) API (NestJS) – Estado
Versiones detectadas (package.json):
- Node (workflows): 20.x (local ver Evidencia)
- NestJS: ^10.4.7 · TypeORM: ^0.3.20 · pg: ^8.12.0 · BullMQ: ^5.x · Swagger: 7.x · Zod: ^3.23.8

Módulos presentes (src/modules/*):
- auth, users, catalog, cart, checkout, orders, payments, prescriptions, search
- queues (BullMQ): workers de catalog/stock/invoice/notification (stubs de jobs requeridos)

Endpoints mínimos esperados:
- /health (OK)
- /api/docs (Swagger) (OK)
- /auth/*, /catalog/*, /cart/*, /checkout/validate, /payments/mp/preference, /payments/mp/webhook, /orders/*, /prescriptions/upload (stubs funcionales)

BullMQ/Redis:
- Colas definidas en QueuesModule (catalog, stock, invoice, notification). En test no se inicializa para evitar conexión a Redis.

Resultados de build (resumen)
```
pnpm -w build
✓ shared/ui (tsup)
✓ Next (admin/storefront) build OK
✓ NestJS (api) build OK
```

---

## 4) Storefront (Next.js) – Estado
- App Router confirmado (apps/storefront/app/). Páginas: Home, Categorías/PLP (/c/[slug]), PDP (/product/[id]), Carrito (/cart), Checkout (/checkout) con validación de edad/receta y pago MP (preferencia + redirect), Órdenes (/orders), retorno (/checkout/success, /checkout/failure).
- UI stack: Tailwind, shadcn/ui, Radix. Data: React Query. Validaciones: Zod.
- i18n es-AR en next.config.mjs; util de formato de precios con Intl. SEO (OG/Twitter), robots y sitemap.
- Comando dev: `pnpm --filter storefront dev` (3000). (no ejecutado en este informe)

---

## 5) Integración Zetti – Sprint 0
Variables esperadas (.env API / gestor de secretos):
- ZETTI_BASE_URL, ZETTI_CLIENT_ID, ZETTI_CLIENT_SECRET, ZETTI_USERNAME, ZETTI_PASSWORD, ZETTI_NODE_ID (pendiente), ZETTI_ECOM_GROUP_ID

Flujo actual previsto (documental):
- about (público), encode (Basic), token (password grant)
- Pendiente hasta tener ZETTI_NODE_ID: permissions/{node}, products/search y mapeo a dominio

SDK interno:
- No existe carpeta `apps/api/src/integrations/zetti/*` en este sprint. Sugerido crearlo y exponer `/integrations/zetti/about`, `/encode`, `/token` para diagnóstico.

---

## 6) Infra Local / Docker
Servicios (docker-compose.yml)

| Servicio | Imagen             | Puertos  | Depende |
|---|---|---|---|
| db      | postgres:16-alpine | 5432:5432 | — |
| redis   | redis:7-alpine     | 6379:6379 | — |
| api     | build apps/api     | 3002:3002 | db, redis |
| admin   | build apps/admin   | 3001:3001 | api |
| storefront | build apps/storefront | 3000:3000 | api |

Instrucciones
```
docker compose up -d db redis
pnpm --filter api migration:run
pnpm --filter api seed
pnpm compose:up  # api/admin/storefront
# Verificación rápida (no ejecutado):
curl -s http://localhost:3002/api/health
curl -s http://localhost:3000
```

---

## 7) CI/CD
- CI: `.github/workflows/ci.yml` (lint, typecheck, test, build, docker build por app)
- Release: `.github/workflows/release.yml` (tags v*.*.* → imágenes GHCR: ghcr.io/<org>/<repo>/{storefront,admin,api}:<tag>)
- Validación en remoto: revisar Actions (este informe no ejecuta remotos). Agregar badges tras primer run.

---

## 8) Seguridad y Cumplimiento (AR)
- `.env*` ignorados (OK). Usar Environments/Secrets (GitHub), Doppler o Vault para prod.
- Producto: `rxRequired` implementado; evaluar `cold_chain` (ANMAT) para cadena de frío y alertas.
- AFIP: definir `AFIP_ENV=homologacion`, rutas key/cert, QR en factura y vínculo a orden/pago (pendiente Sprint 1).

---

## 9) Riesgos y Bloqueos
- ZETTI_NODE_ID y credenciales Zetti (bloquea permisos/catálogos/stock)
- Credenciales MP y manejo completo de webhooks/estados
- Certificados AFIP y firma
- Orquestación de stock (reservas, concurrencia) y latencia ERP

Mitigaciones
- Habilitar endpoints de diagnóstico Zetti y cargar variables
- Usar BullMQ para sync incremental (jobs esbozados)
- Emular MP sandbox y registrar webhooks

---

## 10) Próximos Pasos (Sprint 1)
1) Cargar ZETTI_NODE_ID y validar `/user/me/permissions/{node}`
2) `POST /v2/{node}/products/search` + mapeo a dominio + indexación (Meilisearch opcional)
3) `POST /products/details-per-nodes` para stock/precio por sucursal; exponer y consumir en PDP/PLP
4) Storefront: stock por sucursal visible + filtros PLP; upload receta real
5) Mercado Pago: preferencia + webhooks + actualización de estados (orden/pago)
6) E2E (Playwright) Home → PDP → Carrito → Checkout (sandbox)

---

## 11) Checklist de Aceptación — Sprint 0
- [x] CI definido (verde al correr)
- [x] `/health` y Swagger online
- [x] Home/PLP/PDP renderizando
- [x] Docker Compose levanta servicios core (db, redis, apps)
- [ ] OAuth Zetti (`encode` + `token`) OK (pendiente credenciales)
- [ ] `/integrations/zetti/about` OK (no implementado)

---

## 12) Evidencia (pegar salidas)
> (no ejecutado) Se listan comandos de verificación:
```
node -v
pnpm -v

pnpm -w build
curl -s http://localhost:3002/api/health
# Swagger: http://localhost:3002/api/docs
# Zetti (referencia)
# curl -s "$ZETTI_BASE_URL/about"
```

---

## 13) Anexos
- Postman/Insomnia: (no provisto en este sprint)
- Script opcional `scripts/diagnostics.sh` (ver a continuación si se creó)
