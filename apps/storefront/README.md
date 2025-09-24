Storefront
==========

Env
---

Crea un archivo `env.local` basado en `env.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

Scripts
-------

- pnpm dev (desde root o `pnpm --filter storefront dev`)
- pnpm build

Flujo
-----

- Home: listado de productos con `ProductCard`
- Categorías/PLP: `/c/[slug]`
- PDP: `/product/[id]` muestra stock por sucursal
- Carrito: `/cart`, Drawer accesible desde Home
- Checkout: `/checkout`
  - Valida edad y receta (si aplica)
  - Crea preferencia MP y redirige a `init_point`
  - Retornos: `/checkout/success` y `/checkout/failure`
- Órdenes: `/orders`

Notas
-----

- Selector de sucursal persistente en `localStorage`
- React Query para data fetching
- Zod para validación de formularios
- i18n es-AR y formato de precios util `formatPrice`

QA Checklist
------------

- [ ] Home renderiza productos y Drawer del carrito abre/cierra
- [ ] Selector de sucursal persiste entre recargas
- [ ] PDP muestra stock total y por sucursal
- [ ] `/checkout/validate` falla si `age < 18` o falta receta en RX
- [ ] Preferencia MP redirige y retorna a success/failure
- [ ] `NEXT_PUBLIC_API_URL` configurable y funciona en build


