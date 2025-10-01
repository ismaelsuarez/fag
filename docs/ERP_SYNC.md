# ERP Sync (Zetti) — Guía Rápida

> **📚 Para documentación completa y detallada, consulta:**
> - [INTEGRACION_ZETTI_COMPLETA.md](./INTEGRACION_ZETTI_COMPLETA.md) - Documentación exhaustiva
> - [ZETTI_QUICK_REFERENCE.md](./ZETTI_QUICK_REFERENCE.md) - Referencia rápida

---

# ERP Sync (Zetti) — Guía Rápida

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

---

## 📚 Documentación Adicional

### [INTEGRACION_ZETTI_COMPLETA.md](./INTEGRACION_ZETTI_COMPLETA.md)
Documentación exhaustiva que incluye:
- ✅ Análisis completo de la API de Zetti
- ✅ Modelo jerárquico de nodos explicado
- ✅ Flujo completo de autenticación OAuth 2.0
- ✅ Todos los endpoints implementados
- ✅ Endpoints pendientes y prioridades
- ✅ Ejemplos prácticos de uso
- ✅ Troubleshooting detallado
- ✅ Diagramas de flujo

### [ZETTI_QUICK_REFERENCE.md](./ZETTI_QUICK_REFERENCE.md)
Referencia rápida con:
- ✅ Comandos útiles
- ✅ Ejemplos de curl
- ✅ Estructura de datos
- ✅ Soluciones rápidas
- ✅ Best practices

### Documentación Oficial de Zetti
- **Web:** https://sites.google.com/zetti.com.ar/api-rest-docum-externos/
- **Swagger:** https://demo.zetti.com.ar/api-rest/swagger-ui/index.html
