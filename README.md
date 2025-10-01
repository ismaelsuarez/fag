# ecom-farmacia — Monorepo

## 1) Overview
Ecommerce para cadena de farmacias (≈10 sucursales + central). Monorepo con:
- API en NestJS (dominios: catálogo, stock, precios, carrito, checkout, órdenes, pagos, recetas, permisos/health ERP)
- Frontales en Next.js (Storefront y Admin)
- PostgreSQL para datos, Redis para colas y caching
- Infra local mediante Docker Compose (Postgres, Redis; Meilisearch, MinIO y Nginx planificados para próximos sprints)

Principios
- Modularidad (dominios independientes, SOLID, upserts idempotentes por externalId/ERP)
- Seguridad (secrets fuera del repo, OAuth2/JWT, WAF/Reverse-proxy/Nginx, VPN si aplica)
- Observabilidad mínima (logs estructurados, request-id; /metrics Prometheus en API)

---

## 2) Tech Stack
- Backend: NestJS + TypeORM (Postgres) + Swagger + BullMQ/Redis
- Front: Next.js (App Router) + Tailwind + shadcn/ui + Radix + React Query + Zod
- Infra local: Docker Compose (Postgres, Redis; Meilisearch/MinIO/Nginx planificados)
- Monorepo: pnpm + Turborepo

---

## 3) Estructura del Monorepo
```
/ (raíz)
├─ apps/
│  ├─ api/         # NestJS (TypeORM, Swagger, BullMQ)
│  ├─ storefront/  # Next.js Storefront (App Router)
│  └─ admin/       # Next.js Backoffice (shadcn/ui)
├─ packages/
│  ├─ shared/      # DTOs/Esquemas Zod, tipos compartidos
│  ├─ ui/          # Design system (Tailwind + Radix)
│  └─ config/      # tsconfig/eslint/prettier/commitlint
├─ .github/workflows/ci.yml
├─ .github/workflows/release.yml
├─ docker-compose.yml
└─ README.md
```

Tabla de paquetes

| Paquete       | Tipo | Path             | Scripts principales |
|---|---|---|---|
| ecom-farmacia | root | ./              | dev, build, test, lint, typecheck, release:tag |
| api           | app  | apps/api        | dev, start:dev, build, test, test:e2e, migration:run, seed |
| storefront    | app  | apps/storefront | dev, build |
| admin         | app  | apps/admin      | dev, build |
| shared        | lib  | packages/shared | build, test, typecheck |
| ui            | lib  | packages/ui     | build, test, typecheck |
| config        | lib  | packages/config | (exporta eslint/prettier/tsconfig/commitlint) |

---

## 4) Requisitos / Prerrequisitos
- Node.js LTS ≥ 20.x
- pnpm ≥ 9
- Docker y Docker Compose (para entorno containerizado)
- (Opcional) jq y curl para smoke tests

---

## 5) Variables de Entorno
Si no existe `.env.example` en la raíz, créalo (o usa el provisto en este proyecto).

Core
```
POSTGRES_URL=postgres://ecom:pass@localhost:5432/ecom
REDIS_URL=redis://localhost:6379
MEILI_URL=http://localhost:7700
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
JWT_SECRET=changeme
```

Zetti (ERP)
```
ZETTI_BASE_URL=https://<host-o-dns>/api-rest
ZETTI_CLIENT_ID=<client_id>
ZETTI_CLIENT_SECRET=<client_secret>
ZETTI_USERNAME=<username>
ZETTI_PASSWORD=<password>
ZETTI_NODE_ID=<pendiente>
ZETTI_ECOM_GROUP_ID=2
```

Mercado Pago
```
MP_ACCESS_TOKEN=<...>
MP_WEBHOOK_SECRET=<...>
```

AFIP (homologación)
```
AFIP_ENV=homologacion
AFIP_CERT=/path/a/cert.crt
AFIP_KEY=/path/a/private.key
```

Notas por apps
- apps/api: ver `apps/api/env.example` como referencia (DB/Redis/MP/AFIP/ERP)
- apps/storefront: `env.example` con `NEXT_PUBLIC_API_URL=http://localhost:3002/api`

---

## 6) Arranque en Desarrollo (sin Docker)
```bash
pnpm -w install
pnpm -w run build

# API (http://localhost:3002)
pnpm --filter api run dev        # o: pnpm --filter api run start:dev

# Storefront (http://localhost:3000)
pnpm --filter storefront run dev

# Admin (http://localhost:3001)
pnpm --filter admin run dev
```
Chequeos rápidos
```bash
curl -i http://localhost:3002/api/health
# Swagger: http://localhost:3002/api/docs
```

---

## 7) Arranque con Docker Compose
Servicios y puertos (definidos hoy):
- postgres:5432, redis:6379, api:3002, storefront:3000, admin:3001  
(Meilisearch/MinIO/Nginx planificados para próximos sprints)

```bash
docker compose up -d
docker ps
curl -i http://localhost:3002/api/health
```

---

## 8) Quickstart — Integración Zetti (Smoke)
> Reemplazar variables por las del .env; seguir nombres exactos de Swagger.
```bash
# 1) Reach público
curl -i "$ZETTI_BASE_URL/about"

# 2) Obtener encode (Basic)
curl -s "$ZETTI_BASE_URL/oauth-server/encode?client_id=$ZETTI_CLIENT_ID&client_secret=$ZETTI_CLIENT_SECRET"

# 3) Token (password grant) – pegar ENCODE en Authorization: Basic
curl -s -X POST "$ZETTI_BASE_URL/oauth-server/oauth/token" \
  -H "Authorization: Basic <ENCODE>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "grant_type=password&username=$ZETTI_USERNAME&password=$ZETTI_PASSWORD"
```
Cuando llegue ZETTI_NODE_ID, probar
```
GET  $ZETTI_BASE_URL/user/me/permissions/{ZETTI_NODE_ID}    (Bearer access_token)
POST $ZETTI_BASE_URL/v2/{ZETTI_NODE_ID}/products/search     (con filtros idsGroups o actualizationDateFrom/To)
```

---

## 9) Calidad y Tests
```bash
pnpm -w run lint
pnpm -w run typecheck
pnpm -w run test
# e2e API
pnpm --filter api run test:e2e
```
- Husky: pre-commit (lint+typecheck) y commit-msg (Commitlint) configurados
- E2E sugeridos (próximo sprint): Playwright — Home → PDP → Carrito → Checkout (sandbox)

---

## 10) CI/CD
- CI en `.github/workflows/ci.yml`: lint, typecheck, test, build, docker build por app
- Release en `.github/workflows/release.yml`: push de tag `v*.*.*` publica imágenes en GHCR
- Crear tag desde versión
```bash
pnpm release:tag
```

---

## 11) Troubleshooting
- Puertos ocupados: 3000/3001/3002, 5432, 6379, 7700, 9000/9001
- Node/pnpm: verificar versiones (Node ≥ 20, pnpm ≥ 9)
- .env: claves faltantes → errores en ERP/MP/AFIP
- CORS/Proxy: si el front no llega a la API, revisar `NEXT_PUBLIC_API_URL` y proxy/Nginx
- Windows: considerar WSL2 para Docker/Node

---

## 12) Roadmap corto (siguiente sprint)
- Cargar ZETTI_NODE_ID y validar permisos
- Indexar catálogo (Meilisearch) y exponer stock por sucursal en PDP/PLP
- Integrar Mercado Pago (Preferencias + Webhooks + estados)
- AFIP Homologación (CAE) en checkout

---

## 13) Licencia y Créditos
- Licencia: por definir
- Créditos: Equipo Ismael + colaboradores


