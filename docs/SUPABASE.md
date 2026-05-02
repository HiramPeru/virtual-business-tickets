# Supabase y Base de Datos

## Proyecto

- Project ref: `rbopvzwqcgnwtwwmptxr`
- URL: `https://rbopvzwqcgnwtwwmptxr.supabase.co`
- Dashboard: https://supabase.com/dashboard/project/rbopvzwqcgnwtwwmptxr

## Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rbopvzwqcgnwtwwmptxr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

No versionar `.env.local`.

## Archivos

- `supabase/schema.sql`: snapshot legible del esquema completo.
- `supabase/migrations/202605012353_initial_schema.sql`: migracion inicial.
- `supabase/migrations/202605020340_first_user_admin.sql`: actualiza el trigger para que el primer perfil sea admin.

## Tablas

- `companies`: empresas clientes.
- `contacts`: contactos asociados a empresas.
- `profiles`: usuarios internos, roles `admin` o `technician`.
- `ticket_daily_counters`: secuencia diaria para codigos.
- `tickets`: tickets principales.
- `ticket_comments`: comentarios del ticket.
- `ticket_events`: historial automatico.

## Codigo de Ticket

El trigger genera codigos con formato:

```text
T-YYYYMMDD-0001
```

La tabla `ticket_daily_counters` evita colisiones por concurrencia.

## Primer Admin

El trigger `create_profile_for_new_user()` crea un perfil al registrarse un usuario:

- Si no existe ningun perfil, el rol queda como `admin`.
- Si ya existe al menos un perfil, el rol queda como `technician`.

## RLS

RLS esta activo en:

- `companies`
- `contacts`
- `profiles`
- `tickets`
- `ticket_comments`
- `ticket_events`

La v1 asume usuarios internos autenticados. Por eso los tecnicos pueden leer datos operativos. Las escrituras validan usuario en campos como `created_by`, `updated_by` y `author_id`.

## Aplicar Migraciones

```bash
npx supabase db push
```

## Riesgos Pendientes

- No hay politica granular por cliente o tenant.
- No hay portal de cliente.
- No hay auditoria completa de todos los campos editables, solo eventos principales.
- No hay backups configurados desde este repo; dependen del plan Supabase.
