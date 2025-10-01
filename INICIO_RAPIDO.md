# 🚀 Inicio Rápido - 5 Minutos

## 📦 ¿Primera vez? Usa el script automatizado

```powershell
.\scripts\setup.ps1
```

Este script hará TODO por ti:
- ✅ Instalar dependencias
- ✅ Levantar Docker (PostgreSQL + Redis)
- ✅ Ejecutar migraciones
- ✅ Cargar datos de prueba
- ✅ Crear archivos .env

---

## 🎯 ¿Ya está configurado? Arranca el proyecto

```bash
# Arrancar TODO (API + Storefront + Admin)
pnpm dev
```

**URLs:**
- 🟢 **Storefront**: http://localhost:3000 (Tienda para clientes)
- 🟢 **Admin**: http://localhost:3001 (Panel de administración)
- 🟢 **API**: http://localhost:3002/api (Backend)
- 📚 **Swagger**: http://localhost:3002/api/docs (Documentación API)

---

## 🔧 Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `.\scripts\diagnostico.ps1` | Verificar estado del proyecto |
| `pnpm dev` | Arrancar todo |
| `pnpm dev:api` | Solo API |
| `pnpm dev:storefront` | Solo Storefront |
| `pnpm dev:admin` | Solo Admin |
| `docker compose up -d db redis` | Levantar base de datos |
| `docker compose down` | Detener todo |
| `docker ps` | Ver contenedores corriendo |

---

## ⚡ Solución rápida de problemas

### No arranca la API
```bash
docker compose up -d db redis
cd apps/api
pnpm migration:run
pnpm seed
cd ../..
pnpm dev:api
```

### Puerto ocupado
```bash
# Matar proceso en puerto (ejemplo 3002)
npx kill-port 3002
```

### Error de módulos
```bash
pnpm install
pnpm build
```

---

## 📚 Documentación completa

| Documento | Para qué sirve |
|-----------|----------------|
| [GUIA_ARRANQUE.md](./GUIA_ARRANQUE.md) | **Guía detallada completa** - Lee esto si tienes problemas |
| [CHECKLIST.md](./CHECKLIST.md) | **Lista de verificación paso a paso** - Para seguir en orden |
| [README.md](./README.md) | **Documentación técnica del proyecto** |
| [docs/ERP_SYNC.md](./docs/ERP_SYNC.md) | **Integración con ERP Zetti** |
| [docs/INFORME_SPRINT0.md](./docs/INFORME_SPRINT0.md) | **Estado actual del proyecto** |

---

## ⚙️ Configuración básica

### Editar `apps/api/.env`

```env
# Cambiar esto (obligatorio)
JWT_SECRET=un-secret-muy-largo-y-aleatorio

# Completar para integración con ERP Zetti
ZETTI_CLIENT_ID=tu_client_id
ZETTI_CLIENT_SECRET=tu_secret
ZETTI_USERNAME=tu_usuario
ZETTI_PASSWORD=tu_password

# Completar para pagos (usa TEST al principio)
MP_ACCESS_TOKEN=TEST-tu_token_de_mercadopago
```

---

## 🧪 Verificación rápida

```bash
# 1. Health check
curl http://localhost:3002/api/health

# 2. Ver productos
curl http://localhost:3002/api/catalog/products

# 3. Abrir Swagger
# http://localhost:3002/api/docs
```

---

## 🎉 ¡Listo para desarrollar!

Tu proyecto tiene:
- ✅ Backend NestJS con TypeORM
- ✅ Frontend Next.js (Storefront + Admin)
- ✅ Base de datos PostgreSQL
- ✅ Redis para colas
- ✅ Integración con ERP Zetti (configurable)
- ✅ Mercado Pago (configurable)
- ✅ Facturación AFIP (configurable)

**Endpoints principales:**
- `/api/catalog/products` - Catálogo
- `/api/cart` - Carrito
- `/api/checkout/validate` - Validar compra
- `/api/payments/mp/preference` - Crear pago
- `/api/orders` - Órdenes
- `/api/prescriptions/upload` - Subir recetas

---

## 🆘 ¿Problemas?

1. **Lee**: [GUIA_ARRANQUE.md](./GUIA_ARRANQUE.md)
2. **Ejecuta**: `.\scripts\diagnostico.ps1`
3. **Verifica**: http://localhost:3002/api/docs
4. **Revisa logs**: `docker compose logs -f api`

---

**¡Feliz desarrollo! 🎊**

