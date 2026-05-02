# Virtual Business Tickets

Sistema interno de tickets para Virtual Business, construido con Next.js App Router, Vercel y Supabase.

## Estado Actual

- Produccion: https://virtual-business-tickets.vercel.app
- Supabase project ref: `rbopvzwqcgnwtwwmptxr`
- Supabase dashboard: https://supabase.com/dashboard/project/rbopvzwqcgnwtwwmptxr
- Stack: Next.js 16, React, TypeScript, Supabase Auth/Postgres/RLS, Vercel.
- Branch local: `main`

## Funcionalidad Incluida

- Login con Supabase Auth.
- Ruta `/setup` para crear el primer admin.
- Rutas protegidas para tickets, clientes y perfil.
- Clientes separados en empresas y contactos.
- Creacion manual de tickets para Activacion Cloud, Soporte y Consulta.
- Filtros por estado, prioridad, categoria y plataforma.
- Detalle de ticket con comentarios, asignacion, prioridad, estado e historial.
- Perfil de tecnico editable sin permitir cambio de rol desde la UI.
- SQL de Supabase con RLS, triggers de codigo diario e historial de cambios.

## Documentacion

- [Guia de operacion](docs/OPERACION.md)
- [Arquitectura tecnica](docs/ARQUITECTURA.md)
- [Supabase y base de datos](docs/SUPABASE.md)
- [Despliegue en Vercel](docs/VERCEL.md)
- [Checklist de pruebas](docs/QA.md)
- [Roadmap](docs/ROADMAP.md)

## Instalacion Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Completa `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rbopvzwqcgnwtwwmptxr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Flujo Inicial

1. Abre `/setup`.
2. Crea el primer usuario.
3. El primer perfil creado queda como `admin`.
4. Ingresa por `/login`.
5. Crea clientes y tickets.

Si ya existe al menos un perfil, los usuarios nuevos creados por Supabase quedan como `technician`.

## Comandos Utiles

```bash
npm run dev
npm run build
npx supabase db push
npx vercel --prod --yes
```

## Notas de Producto

Esta v1 es interna para tecnicos. El campo `customer_visible` queda preparado para un futuro portal de clientes, pero por ahora todos los comentarios se gestionan dentro del panel tecnico.
