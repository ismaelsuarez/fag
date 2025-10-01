# 🚀 Zetti API - Quick Reference Guide

## 📌 Resumen Ejecutivo

| Aspecto | Detalle |
|---------|---------|
| **Tipo de API** | REST con OAuth 2.0 |
| **Formato** | JSON |
| **Base URL (Demo)** | https://demo.zetti.com.ar |
| **Base URL (Prod)** | Tu servidor específico |
| **Documentación** | https://sites.google.com/zetti.com.ar/api-rest-docum-externos/ |
| **Swagger** | https://demo.zetti.com.ar/api-rest/swagger-ui/index.html |

---

## 🔑 Credenciales Requeridas

```bash
# OAuth Credentials (proporcionadas por Zetti)
ZETTI_CLIENT_ID=tu_client_id
ZETTI_CLIENT_SECRET=tu_secret
ZETTI_USERNAME=tu_usuario
ZETTI_PASSWORD=tu_password

# Node IDs (proporcionados por Zetti)
ZETTI_NODE_GRUPO=2350520        # Nodo principal
ZETTI_NODE_FARMACIA=2350521     # Tu farmacia
```

---

## 🔐 Autenticación - 3 Pasos

### 1️⃣ Obtener Encode
```bash
GET /oauth-server/encode?client_id=XXX&client_secret=YYY
```
**Respuesta:** `{ "encode": "Base64String" }`

### 2️⃣ Obtener Token
```bash
POST /oauth-server/oauth/token
Headers: Authorization: Basic {encode}
Body: grant_type=password&username=XXX&password=YYY
```
**Respuesta:** `{ "access_token": "...", "expires_in": 3600 }`

### 3️⃣ Usar Token
```bash
GET /about
Headers: Authorization: Bearer {access_token}
```

**✅ Tu implementación gestiona esto automáticamente.**

---

## 📡 Endpoints Principales

### 🟢 Health Check (No Auth)
```bash
GET /about
```
**Uso:** Verificar servidor y versión

**Respuesta:**
```json
{
  "version": "3.5.0",
  "serverAlias": "DEMO"
}
```

**Tu endpoint:**
```bash
GET http://localhost:3002/api/erp/health
```

---

### 🔓 Verificar Permisos
```bash
GET /user/me/permissions/{nodeId}
```
**Parámetros:**
- `{nodeId}`: ID de tu nodo grupo

**Respuesta:**
```json
{
  "permissions": ["READ_PRODUCTS", "WRITE_PRODUCTS"]
}
```

**Tu endpoint:**
```bash
GET http://localhost:3002/api/erp/permissions/2350520
```

---

### 📦 Buscar Productos (Por Grupos)
```bash
POST /v2/{nodeId}/products/search
```
**Body:**
```json
{
  "idsGroups": [2],
  "page": 0,
  "size": 500
}
```

**Respuesta:**
```json
{
  "content": [
    {
      "id": "12345",
      "name": "IBUPROFENO 400MG",
      "brand": "Bayer"
    }
  ],
  "totalPages": 5,
  "totalElements": 2341
}
```

**Tu endpoint:**
```bash
POST http://localhost:3002/api/erp/sync/products
Content-Type: application/json

{
  "mode": "full",
  "groups": [2]
}
```

---

### 🔄 Buscar Productos (Incremental)
```bash
POST /v2/{nodeId}/products/search
```
**Body:**
```json
{
  "actualizationDateFrom": "2025-10-01",
  "actualizationDateTo": "2025-10-02",
  "page": 0,
  "size": 500
}
```

**Tu endpoint:**
```bash
POST http://localhost:3002/api/erp/sync/products
Content-Type: application/json

{
  "mode": "incremental",
  "from": "2025-10-01",
  "to": "2025-10-02"
}
```

---

### 💰 Obtener Stock y Precios
```bash
POST /{nodeId}/products/details-per-nodes
```
**Body:**
```json
{
  "nodeIds": ["FARMACIA_001"],
  "productIds": ["12345", "67890"]
}
```

**Respuesta:**
```json
{
  "items": [
    {
      "nodeId": "FARMACIA_001",
      "productId": "12345",
      "skuId": "SKU-001",
      "price": 850.50,
      "currency": "ARS",
      "stock": 150,
      "stockReserved": 10
    }
  ]
}
```

**✅ Procesado automáticamente** en sincronización.

---

## 🗂️ Estructura de Nodos

```
NODO GRUPO (2350520)
  └── NODO SOCIEDAD
       ├── FARMACIA 001 (2350521)
       ├── FARMACIA 002 (2350522)
       └── FARMACIA 003 (2350523)
```

**Regla:**
- Usa **NODO GRUPO** para búsquedas y catálogo
- Usa **IDs de FARMACIA** para stock/precios específicos

---

## 🔄 Flujos de Sincronización

### Sincronización Completa
```
1. Buscar todos los productos por grupos
   ↓
2. Paginar resultados (500 por página)
   ↓
3. Para cada batch de productos:
   - Obtener detalles (stock/precio)
   ↓
4. Guardar en DB (erp_products, erp_skus, erp_branch_stock)
```

**Comando:**
```bash
curl -X POST http://localhost:3002/api/erp/sync/products \
  -H "Content-Type: application/json" \
  -d '{"mode":"full","groups":[2]}'
```

### Sincronización Incremental
```
1. Buscar productos modificados en rango de fechas
   ↓
2. Obtener solo productos actualizados
   ↓
3. Actualizar solo esos productos en DB
```

**Comando:**
```bash
curl -X POST http://localhost:3002/api/erp/sync/products \
  -H "Content-Type: application/json" \
  -d '{
    "mode":"incremental",
    "from":"2025-10-01",
    "to":"2025-10-02"
  }'
```

---

## 📊 Tablas de Base de Datos

### `erp_products`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID interno |
| externalId | String | ID de Zetti |
| name | String | Nombre del producto |
| brand | String | Marca |
| category | String | Categoría |
| isPrescription | Boolean | Requiere receta |

### `erp_skus`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID interno |
| externalId | String | ID SKU de Zetti |
| productId | UUID | FK a erp_products |
| code | String | Código SKU |
| barcode | String | Código de barras |

### `erp_branch_stock`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID interno |
| skuId | UUID | FK a erp_skus |
| branchId | String | ID de la farmacia |
| price | Numeric | Precio |
| currency | String | Moneda (ARS) |
| stock | Integer | Stock total |
| stockReserved | Integer | Stock reservado |

**Stock disponible = stock - stockReserved**

---

## ⚙️ Configuración Rate Limiting

```bash
# Controla requests por segundo
ZETTI_RATE_LIMIT_QPS=8

# Tamaño de página
ZETTI_PAGE_SIZE=500
```

**Cálculo:**
- QPS = 8 → 1 request cada 125ms
- Tu `ZettiClient` maneja esto automáticamente

---

## 🐛 Troubleshooting Rápido

### ❌ Error 401 - Unauthorized
```bash
# Verificar credenciales
echo $ZETTI_CLIENT_ID
echo $ZETTI_USERNAME

# Probar manualmente OAuth
curl "https://demo.zetti.com.ar/oauth-server/encode?client_id=$ZETTI_CLIENT_ID&client_secret=$ZETTI_CLIENT_SECRET"
```

### ❌ Error 404 - Node not found
```bash
# Verificar IDs de nodo
echo $ZETTI_NODE_GRUPO

# Contactar a Zetti para obtener IDs correctos
```

### ❌ Timeout
```bash
# Reducir tamaño de página
ZETTI_PAGE_SIZE=200

# O reducir QPS
ZETTI_RATE_LIMIT_QPS=5
```

### ❌ Connection refused
```bash
# Verificar URL
curl https://demo.zetti.com.ar/api-rest/about

# En producción, usar tu URL específica
ZETTI_API_BASE=https://tu-servidor.com/api-rest
```

---

## 🔧 Comandos Útiles

### Health Check
```bash
curl http://localhost:3002/api/erp/health
```

### Verificar Permisos
```bash
curl http://localhost:3002/api/erp/permissions/2350520
```

### Sincronización Completa
```bash
curl -X POST http://localhost:3002/api/erp/sync/products \
  -H "Content-Type: application/json" \
  -d '{"mode":"full","groups":[2]}'
```

### Sincronización Incremental (Hoy)
```bash
curl -X POST http://localhost:3002/api/erp/sync/products \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"incremental\",\"from\":\"$(date +%Y-%m-%d)T00:00:00\",\"to\":\"$(date +%Y-%m-%d)T23:59:59\"}"
```

### Ver Logs
```bash
docker compose logs -f api | grep "SyncService"
```

---

## 📝 Checklist de Integración

### Setup Inicial
- [ ] Obtener credenciales de Zetti
- [ ] Configurar variables en `.env`
- [ ] Probar `/about` (health check)
- [ ] Verificar permisos con `/permissions`

### Sincronización
- [ ] Ejecutar sincronización completa
- [ ] Verificar datos en base de datos
- [ ] Configurar sincronización incremental
- [ ] Configurar cron/scheduler

### Producción
- [ ] Cambiar URLs a producción
- [ ] Ajustar rate limiting
- [ ] Configurar monitoreo
- [ ] Implementar alertas

---

## 🎯 Best Practices

### ✅ DO
- Usar sincronización incremental para actualizaciones frecuentes
- Implementar retry con backoff exponencial
- Respetar rate limits
- Monitorear logs y métricas
- Usar refresh token cuando sea posible

### ❌ DON'T
- No hacer sincronización completa muy seguido
- No ignorar errores de autenticación
- No exceder rate limits
- No hardcodear credenciales
- No usar nodos incorrectos

---

## 📚 Recursos

| Recurso | URL |
|---------|-----|
| Documentación Oficial | https://sites.google.com/zetti.com.ar/api-rest-docum-externos/ |
| Swagger Demo | https://demo.zetti.com.ar/api-rest/swagger-ui/index.html |
| Tu Documentación Completa | [INTEGRACION_ZETTI_COMPLETA.md](./INTEGRACION_ZETTI_COMPLETA.md) |
| Código `ZettiClient` | `apps/api/src/erp-sync/zetti.client.ts` |
| Código `SyncService` | `apps/api/src/erp-sync/sync.service.ts` |

---

**⚡ Tip:** Guarda este documento para referencia rápida durante el desarrollo.

