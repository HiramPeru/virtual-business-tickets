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
- `supabase/migrations/202605020500_harden_auth_policies.sql`: cierra acceso operativo para cuentas pendientes y endurece RLS.
- `supabase/migrations/202605020620_principal_clients_and_users.sql`: agrega clientes principales, roles de operador y acceso cliente solo lectura.

## Tablas

- `companies`: empresas clientes.
- `principal_clients`: clientes principales como WOW Perú que agrupan empresas.
- `contacts`: contactos asociados a empresas.
- `profiles`: usuarios internos y externos, roles `admin`, `operator`, `client_readonly` o `pending`.
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
- Si ya existe al menos un perfil, el rol queda como `pending`.
- `/setup` consulta `has_any_profile()` y queda cerrado cuando ya existe un perfil.

## RLS

RLS esta activo en:

- `companies`
- `contacts`
- `profiles`
- `tickets`
- `ticket_comments`
- `ticket_events`

La v1 permite operar tickets y clientes solo a perfiles `admin` u `operator`. Los usuarios `client_readonly` solo pueden leer tickets, historial y comentarios visibles de su cliente principal. Las cuentas `pending` pueden existir en Auth, pero RLS les bloquea clientes, tickets, comentarios e historial.

Para crear usuarios desde la app, Vercel debe tener `SUPABASE_SERVICE_ROLE_KEY` como variable de entorno de produccion. No debe exponerse en cliente ni versionarse.

## Aplicar Migraciones

```bash
npx supabase db push
```

## Riesgos Pendientes

- No hay politica granular por cliente o tenant.
- No hay portal de cliente.
- No hay auditoria completa de todos los campos editables, solo eventos principales.
- No hay backups configurados desde este repo; dependen del plan Supabase.
