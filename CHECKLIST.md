# ✅ Checklist de Arranque Rápido

## 📋 Antes de Empezar

- [ ] Node.js >= 20 instalado (`node -v`)
- [ ] pnpm >= 9 instalado (`pnpm -v`)
- [ ] Docker Desktop instalado y corriendo
- [ ] Git instalado

---

## 🚀 Pasos de Configuración

### 1️⃣ Instalación Inicial

- [ ] Clonar el repositorio (si aún no lo has hecho)
- [ ] Abrir terminal en la raíz del proyecto
- [ ] Ejecutar: `pnpm install`
- [ ] Esperar a que termine la instalación (puede tomar varios minutos)

### 2️⃣ Servicios Docker

- [ ] Ejecutar: `docker compose up -d db redis`
- [ ] Verificar con: `docker ps`
- [ ] Deberías ver `ecom-db` y `ecom-redis` corriendo

### 3️⃣ Base de Datos

- [ ] Ir a la carpeta API: `cd apps/api`
- [ ] Ejecutar migraciones: `pnpm migration:run`
- [ ] Cargar datos de prueba: `pnpm seed`
- [ ] Volver a la raíz: `cd ../..`

### 4️⃣ Configuración de Variables de Entorno

Archivos ya creados ✅:
- `apps/api/.env`
- `apps/storefront/.env.local`
- `apps/admin/.env.local`

**Editar `apps/api/.env` y completar:**

#### Obligatorias para funcionar básicamente:
- [ ] `JWT_SECRET` - Cambiar por un string largo y aleatorio
- [ ] `CORS_ORIGINS` - Verificar que incluya `http://localhost:3000,http://localhost:3001`

#### Opcionales (para funcionalidad completa):
- [ ] `ZETTI_CLIENT_ID` - ID de cliente del ERP
- [ ] `ZETTI_CLIENT_SECRET` - Secret del ERP
- [ ] `ZETTI_USERNAME` - Usuario Zetti
- [ ] `ZETTI_PASSWORD` - Contraseña Zetti
- [ ] `ZETTI_NODE_GRUPO` - Nodo grupo Zetti
- [ ] `ZETTI_NODE_FARMACIA` - Nodo farmacia Zetti
- [ ] `MP_ACCESS_TOKEN` - Token de Mercado Pago (TEST para desarrollo)

---

## 🎯 Arrancar las Aplicaciones

### Opción A: Todo junto (Recomendado)
- [ ] Desde la raíz: `pnpm dev`
- [ ] Esperar a que las 3 apps arranquen

### Opción B: Por separado
- [ ] Terminal 1: `pnpm dev:api`
- [ ] Terminal 2: `pnpm dev:storefront`
- [ ] Terminal 3: `pnpm dev:admin`

---

## 🧪 Verificación

### API (http://localhost:3002)
- [ ] Abrir: http://localhost:3002/api/health
- [ ] Debe responder: `{"status":"ok"}`
- [ ] Abrir Swagger: http://localhost:3002/api/docs
- [ ] Debe mostrar documentación de la API

### Productos
- [ ] Verificar productos con curl o en Swagger:
  ```bash
  curl http://localhost:3002/api/catalog/products
  ```
- [ ] Debe devolver array con 2 productos (Ibuprofeno y Amoxicilina)

### Storefront (http://localhost:3000)
- [ ] Abrir: http://localhost:3000
- [ ] Debe cargar la página principal
- [ ] Debe mostrar los productos
- [ ] No debe haber errores en la consola del navegador

### Admin (http://localhost:3001)
- [ ] Abrir: http://localhost:3001
- [ ] Debe cargar el panel de admin

---

## 🔧 Script de Diagnóstico

Ejecuta el script de diagnóstico para verificar todo:

```powershell
.\scripts\diagnostico.ps1
```

Este script verificará:
- ✅ Versiones de Node y pnpm
- ✅ Docker instalado
- ✅ Archivos .env creados
- ✅ Dependencias instaladas
- ✅ Contenedores corriendo
- ✅ Puertos disponibles
- ✅ APIs respondiendo
- ✅ Configuración completa

---

## 🐛 Solución Rápida de Problemas

### "Cannot connect to database"
```bash
docker compose up -d db
# Esperar 5 segundos
cd apps/api
pnpm migration:run
```

### "Port already in use"
```bash
# Matar proceso en puerto 3002
npx kill-port 3002
# O identificar proceso:
netstat -ano | findstr :3002
```

### "Module not found"
```bash
# Desde la raíz
pnpm install
pnpm build
```

### Storefront no muestra productos
```bash
# Verificar que la API esté corriendo
curl http://localhost:3002/api/catalog/products

# Si no hay productos, ejecutar seed:
cd apps/api
pnpm seed
```

---

## 📊 Endpoints Principales para Probar

Puedes probar estos endpoints en Swagger o con curl:

### Catálogo
```bash
# Listar productos
curl http://localhost:3002/api/catalog/products

# Detalle de producto (reemplazar {id} con un ID real)
curl http://localhost:3002/api/catalog/products/{id}
```

### Health Check
```bash
curl http://localhost:3002/api/health
```

---

## 🎉 ¡Listo!

Si todos los checkboxes están marcados y las verificaciones pasan, tu proyecto está funcionando correctamente.

### Próximos pasos:

1. **Completar credenciales de integraciones** (Zetti, Mercado Pago)
2. **Sincronizar catálogo desde Zetti**
3. **Agregar sucursales a la base de datos**
4. **Probar el flujo completo de compra**

---

## 📚 Documentación

- [GUIA_ARRANQUE.md](./GUIA_ARRANQUE.md) - Guía detallada completa
- [README.md](./README.md) - Documentación del proyecto
- [docs/ERP_SYNC.md](./docs/ERP_SYNC.md) - Integración con Zetti
- [docs/INFORME_SPRINT0.md](./docs/INFORME_SPRINT0.md) - Estado actual

---

**💡 Tip:** Imprime esta checklist o márcala mientras avanzas para asegurarte de no saltear ningún paso.

