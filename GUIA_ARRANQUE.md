# 🚀 Guía Completa de Arranque - Ecommerce Farmacia

## 📋 Resumen del Proyecto

Este es un ecommerce para una cadena de farmacias con:
- **API NestJS** con TypeORM + PostgreSQL + Redis + BullMQ
- **Storefront Next.js** (App Router) - Tienda online para clientes
- **Admin Next.js** - Panel de administración
- **Integración ERP Zetti** - Sincronización de productos y stock
- **Mercado Pago** - Pasarela de pagos
- **AFIP** - Facturación electrónica

---

## ✅ Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** >= 20.x → [Descargar](https://nodejs.org/)
- **pnpm** >= 9.x → Instalar: `npm install -g pnpm`
- **Docker Desktop** → [Descargar](https://www.docker.com/products/docker-desktop)
- **Git** → [Descargar](https://git-scm.com/)

Verifica las versiones:
```bash
node -v    # debe mostrar v20.x o superior
pnpm -v    # debe mostrar 9.x o superior
docker -v  # debe estar instalado
```

---

## 🔧 Paso 1: Instalar Dependencias

Desde la raíz del proyecto:

```bash
pnpm install
```

Este comando instalará todas las dependencias de todas las aplicaciones (api, storefront, admin) y los paquetes compartidos (shared, ui, config).

---

## 🐳 Paso 2: Levantar Servicios con Docker

Levanta PostgreSQL y Redis usando Docker Compose:

```bash
docker compose up -d db redis
```

Verifica que estén corriendo:
```bash
docker ps
```

Deberías ver:
- `ecom-db` (PostgreSQL) en puerto 5432
- `ecom-redis` (Redis) en puerto 6379

---

## 🗄️ Paso 3: Configurar Base de Datos

### 3.1 Ejecutar Migraciones

Las migraciones crearán todas las tablas necesarias:

```bash
cd apps/api
pnpm migration:run
```

Esto creará las tablas:
- users, customers, addresses
- products, product_variants, stock_items, prices
- branches (sucursales)
- carts, orders, order_items
- payments, invoices
- prescriptions

### 3.2 Cargar Datos Iniciales (Seed)

```bash
pnpm seed
```

Esto cargará:
- ✅ Usuario demo: `demo@local`
- ✅ 2 productos de ejemplo (Ibuprofeno, Amoxicilina)

---

## ⚙️ Paso 4: Configurar Variables de Entorno

Ya se crearon los archivos `.env` básicos, pero necesitas completar las credenciales:

### 📝 apps/api/.env

Abre el archivo y completa las siguientes variables:

#### 🔐 Credenciales Zetti ERP (Requeridas para sincronizar catálogo)
```env
ZETTI_CLIENT_ID=tu_client_id_aqui
ZETTI_CLIENT_SECRET=tu_client_secret_aqui
ZETTI_USERNAME=tu_usuario_zetti
ZETTI_PASSWORD=tu_password_zetti
ZETTI_NODE_GRUPO=tu_node_grupo_aqui
ZETTI_NODE_FARMACIA=tu_node_farmacia_aqui
```

#### 💳 Credenciales Mercado Pago (Usa TEST primero)
```env
MP_ACCESS_TOKEN=TEST-tu_access_token_de_test_aqui
```

Para obtener credenciales de Mercado Pago TEST:
1. Ir a: https://www.mercadopago.com.ar/developers/
2. Crear una aplicación
3. Copiar el "Access Token de prueba"

#### 🔒 JWT Secret (Cambiar en producción)
```env
JWT_SECRET=un-secret-muy-largo-y-aleatorio-para-produccion
```

### 📝 apps/storefront/.env.local

Ya está configurado con:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

### 📝 apps/admin/.env.local

Ya está configurado con:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

---

## 🚀 Paso 5: Arrancar las Aplicaciones

### Opción A: Arrancar todo en paralelo (Recomendado para desarrollo)

Desde la raíz del proyecto:
```bash
pnpm dev
```

Esto arrancará:
- 🟢 API: http://localhost:3002
- 🟢 Storefront: http://localhost:3000
- 🟢 Admin: http://localhost:3001

### Opción B: Arrancar cada app por separado

En terminales separadas:

**Terminal 1 - API:**
```bash
pnpm dev:api
```

**Terminal 2 - Storefront:**
```bash
pnpm dev:storefront
```

**Terminal 3 - Admin:**
```bash
pnpm dev:admin
```

---

## 🧪 Paso 6: Verificar que Todo Funciona

### 1. Verificar API
```bash
curl http://localhost:3002/api/health
```
Debe responder: `{"status":"ok"}`

### 2. Swagger (Documentación API)
Abre en tu navegador: http://localhost:3002/api/docs

### 3. Verificar Productos
```bash
curl http://localhost:3002/api/catalog/products
```
Debe devolver los 2 productos de ejemplo.

### 4. Verificar Storefront
Abre en tu navegador: http://localhost:3000
- Deberías ver el storefront con los productos cargados

### 5. Verificar Admin
Abre en tu navegador: http://localhost:3001
- Panel de administración (todavía básico)

---

## 📊 Endpoints Principales de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado de salud |
| GET | `/api/docs` | Swagger UI |
| GET | `/api/catalog/products` | Listar productos |
| GET | `/api/catalog/products/:id` | Detalle de producto |
| GET | `/api/catalog/stock/:variantId` | Stock de variante |
| POST | `/api/cart` | Crear carrito |
| POST | `/api/checkout/validate` | Validar checkout |
| POST | `/api/payments/mp/preference` | Crear preferencia MP |
| POST | `/api/payments/mp/webhook` | Webhook de MP |
| GET | `/api/orders` | Listar órdenes |
| POST | `/api/prescriptions/upload` | Subir receta |

---

## 🔄 Sincronización con ERP Zetti

Una vez configuradas las credenciales de Zetti, puedes sincronizar productos:

### Verificar conexión con Zetti
```bash
curl http://localhost:3002/api/erp/health
```

### Sincronización Completa (primera vez)
```bash
curl -X POST http://localhost:3002/api/erp/sync/products \
  -H "Content-Type: application/json" \
  -d '{"mode":"full"}'
```

### Sincronización Incremental (actualizaciones)
```bash
curl -X POST http://localhost:3002/api/erp/sync/products \
  -H "Content-Type: application/json" \
  -d '{"mode":"incremental","from":"2024-10-01","to":"2024-10-02"}'
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to database"
- ✅ Verifica que Docker esté corriendo: `docker ps`
- ✅ Verifica que PostgreSQL esté levantado
- ✅ Revisa las credenciales en `apps/api/.env`

### Error: "Cannot connect to Redis"
- ✅ Verifica que Redis esté corriendo: `docker ps`
- ✅ Asegúrate que el puerto 6379 no esté ocupado

### Error: "Port already in use"
- ✅ Puerto 3000: `npx kill-port 3000`
- ✅ Puerto 3001: `npx kill-port 3001`
- ✅ Puerto 3002: `npx kill-port 3002`
- ✅ Puerto 5432: Otro PostgreSQL corriendo
- ✅ Puerto 6379: Otro Redis corriendo

### Error: "Module not found"
- ✅ Ejecuta: `pnpm install` desde la raíz
- ✅ Ejecuta: `pnpm build` desde la raíz

### Storefront no muestra productos
- ✅ Verifica que la API esté corriendo
- ✅ Verifica `NEXT_PUBLIC_API_URL` en `.env.local`
- ✅ Ejecuta el seed: `pnpm --filter api seed`
- ✅ Verifica en Swagger: http://localhost:3002/api/docs

### Error de CORS
- ✅ Agrega `CORS_ORIGINS=http://localhost:3000,http://localhost:3001` en `apps/api/.env`

---

## 🧪 Testing

### Tests Unitarios
```bash
pnpm test
```

### Tests E2E de la API
```bash
pnpm --filter api test:e2e
```

### Linter
```bash
pnpm lint
```

### Type Checking
```bash
pnpm typecheck
```

---

## 📦 Build para Producción

### Build de todas las apps
```bash
pnpm build
```

### Build individual
```bash
pnpm build:api
pnpm build:storefront
pnpm build:admin
```

---

## 🐳 Docker Compose (Producción)

Para levantar todo el stack (db, redis, api, storefront, admin):

```bash
docker compose up --build -d
```

Para detener:
```bash
docker compose down
```

Para ver logs:
```bash
docker compose logs -f api
docker compose logs -f storefront
```

---

## 📚 Estructura del Proyecto

```
fag/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/  # Auth, Catalog, Cart, Checkout, etc.
│   │   │   ├── entities/ # TypeORM entities
│   │   │   ├── database/ # Migrations
│   │   │   └── erp-sync/ # Integración Zetti
│   │   └── .env          # Variables de entorno API
│   ├── storefront/       # Frontend clientes
│   │   ├── app/          # Next.js App Router
│   │   ├── components/
│   │   └── .env.local
│   └── admin/            # Frontend admin
│       └── .env.local
├── packages/
│   ├── shared/           # DTOs compartidos
│   ├── ui/               # Design system
│   └── config/           # Configs compartidas
└── docker-compose.yml
```

---

## 🔐 Seguridad

### Para Desarrollo ✅
- Usar credenciales TEST de Mercado Pago
- JWT_SECRET simple está OK
- Base de datos local

### Para Producción ⚠️
- **NUNCA** commitear archivos .env
- Usar variables de entorno del servidor
- JWT_SECRET muy fuerte (>32 caracteres aleatorios)
- Credenciales PROD de Mercado Pago
- Certificados AFIP en lugar seguro
- HTTPS obligatorio
- WAF/Reverse Proxy (Nginx)
- Rate limiting
- Backups de base de datos

---

## 📞 Próximos Pasos

1. ✅ **Completar credenciales** de Zetti, Mercado Pago y AFIP
2. ✅ **Sincronizar catálogo** desde Zetti
3. ✅ **Agregar sucursales (branches)** en la base de datos
4. ✅ **Configurar stock por sucursal**
5. ✅ **Probar flujo completo**: Home → PDP → Carrito → Checkout → Pago MP
6. ✅ **Configurar webhooks** de Mercado Pago
7. ✅ **Implementar facturación AFIP**
8. ✅ **Tests E2E** con Playwright

---

## 📖 Documentación Adicional

- [ERP_SYNC.md](./docs/ERP_SYNC.md) - Integración con Zetti
- [INFORME_SPRINT0.md](./docs/INFORME_SPRINT0.md) - Estado del Sprint 0
- [README.md](./README.md) - Documentación general

---

## ❓ ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs: `docker compose logs -f api`
2. Verifica la configuración de `.env`
3. Consulta Swagger: http://localhost:3002/api/docs
4. Revisa los tests E2E para ver ejemplos de uso

---

**¡Tu ecommerce de farmacia está listo para funcionar! 🎉**

