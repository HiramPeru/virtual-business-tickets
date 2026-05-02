# Arquitectura Tecnica

## Stack

- Next.js App Router.
- TypeScript estricto.
- Supabase SSR con `@supabase/ssr`.
- Supabase Auth para sesion.
- Supabase Postgres con RLS.
- Vercel para hosting.

## Estructura Principal

```text
src/
  app/
    (auth)/
      login/page.tsx
      setup/page.tsx
    (dashboard)/
      layout.tsx
      tickets/
      customers/
      profile/
    api/
      tickets/
      customers/
      profile/
    lib/
      env.ts
      options.ts
      supabase-browser.ts
      supabase-server.ts
  components/
  proxy.ts
supabase/
  schema.sql
  migrations/
docs/
```

## Autenticacion

- `src/proxy.ts` protege `/tickets`, `/customers` y `/profile`.
- `/login` y `/setup` son publicos.
- Si el usuario no tiene sesion, se redirige a `/login`.
- Si el usuario ya tiene sesion e intenta abrir `/login` o `/setup`, se redirige a `/tickets`.

## Clientes Supabase

- `src/app/lib/supabase-browser.ts`: cliente para componentes client-side.
- `src/app/lib/supabase-server.ts`: cliente para Server Components, Route Handlers y Server Actions.
- `src/app/lib/env.ts`: valida variables de entorno.

## Rutas API

- `GET /api/tickets`: lista tickets con filtros.
- `POST /api/tickets`: crea ticket.
- `PATCH /api/tickets/[id]`: actualiza campos permitidos.
- `POST /api/tickets/[id]/comments`: crea comentario.
- `GET /api/customers?search=`: busca contactos.
- `POST /api/customers`: crea contacto y empresa si aplica.
- `PATCH /api/profile`: actualiza nombre del tecnico.

## Paginas

- `/setup`: crea primer admin.
- `/login`: inicia sesion.
- `/tickets`: listado filtrable.
- `/tickets/new`: creacion de ticket.
- `/tickets/[id]`: detalle, acciones, comentarios e historial.
- `/customers`: listado de contactos.
- `/customers/new`: alta manual de cliente.
- `/profile`: edicion de nombre visible.

## Decisiones de Diseno

- Se separo `companies` de `contacts` para soportar empresas con varios contactos.
- Se agrego `ticket_events` para preservar historial operativo.
- Se usa `proxy.ts` porque Next.js 16 reemplaza la convencion antigua `middleware.ts`.
- La UI es funcional y compacta, pensada para operadores tecnicos.
