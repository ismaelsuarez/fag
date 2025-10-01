# ERP Sync (Zetti) — Guía

## Variables (.env apps/api/env.example)
```
ZETTI_API_BASE=https://demo.zetti.com.ar/api-rest
ZETTI_OAUTH_BASE=https://demo.zetti.com.ar/oauth-server
ZETTI_CLIENT_ID=
ZETTI_CLIENT_SECRET=
ZETTI_USERNAME=
ZETTI_PASSWORD=
ZETTI_NODE_GRUPO=
ZETTI_NODE_FARMACIA=
ZETTI_GROUP_IDS=2
ZETTI_PAGE_SIZE=500
ZETTI_RATE_LIMIT_QPS=8
```

## Flujo OAuth y smoke
```bash
# Encode
curl -s "$ZETTI_OAUTH_BASE/encode?client_id=$ZETTI_CLIENT_ID&client_secret=$ZETTI_CLIENT_SECRET"
# Token (password)
curl -s -X POST "$ZETTI_OAUTH_BASE/oauth/token" \
  -H "Authorization: Basic <ENCODE>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "grant_type=password&username=$ZETTI_USERNAME&password=$ZETTI_PASSWORD"
# About
curl -s "$ZETTI_API_BASE/about"
# Permisos por nodo
curl -s "$ZETTI_API_BASE/user/me/permissions/$ZETTI_NODE_GRUPO" -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Endpoints API interna
- POST /erp/sync/products { mode:'full'|'incremental', groups?: number[], from?: string, to?: string }
- GET  /erp/health
- GET  /erp/permissions/:nodeId

## Jobs y DLQ
- Cola principal: `erp:products`; DLQ: `erp:products:dlq`
- Reintentos: attempts=5, backoff exponencial

## Idempotencia
- Upsert por `externalId` en Product/Sku
- Transacciones al consolidar detalles por nodo

## Incrementales
- Buscar por `actualizationDateFrom/To` y detallar por nodos (pricing/stock)

## Notas
- Respetar rate-limit QPS (`ZETTI_RATE_LIMIT_QPS`)
- Logs pino con `x-request-id` y métricas en `/metrics`
