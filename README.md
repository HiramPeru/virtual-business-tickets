# Virtual Business Tickets

Sistema interno de tickets para Virtual Business, construido con Next.js App Router, Vercel y Supabase.

## Funcionalidad incluida

- Login con Supabase Auth.
- Rutas protegidas para tickets, clientes y perfil.
- Clientes separados en empresas y contactos.
- Creación manual de tickets para Activacion Cloud, Soporte y Consulta.
- Filtros por estado, prioridad, categoría y plataforma.
- Detalle de ticket con comentarios, asignación, prioridad, estado e historial.
- Perfil de técnico editable sin permitir cambio de rol desde la UI.
- SQL de Supabase con RLS, triggers de código diario e historial de cambios.

## Instalación local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Completa `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Supabase

1. Crea un proyecto en Supabase.
2. Abre SQL Editor.
3. Ejecuta el contenido de `supabase/schema.sql`.
4. Crea el primer usuario desde Authentication.
5. Promueve el primer usuario a admin:

```sql
UPDATE profiles
SET role = 'admin', full_name = 'Administrador Virtual Business'
WHERE id = 'UUID_DEL_USUARIO';
```

## Vercel

1. Importa este repositorio en Vercel.
2. Configura variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Despliega.

## Notas de producto

Esta v1 es interna para técnicos. El campo `customer_visible` queda preparado para un futuro portal de clientes, pero por ahora todos los comentarios se gestionan dentro del panel técnico.
