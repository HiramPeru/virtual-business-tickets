# Spec: Auth access incident

## Metadata

- Fecha: 2026-05-24
- Estado: in_progress
- Owner: Codex
- Rama/commit: pendiente
- Area: seguridad

## Problema

El usuario no puede acceder a la web porque sus credenciales no funcionan. El incidente puede estar en autenticacion Supabase, estado del usuario, rol `pending`, contrasena, confirmacion de email, variables de produccion o despliegue apuntando a otra configuracion.

## Objetivo

Diagnosticar la causa sin exponer credenciales, restaurar acceso operativo y dejar evidencia clara del cambio o procedimiento aplicado.

## Usuarios y roles afectados

- Admin: puede quedar bloqueado si su cuenta, contrasena o rol no estan activos.
- Operador: puede quedar bloqueado por credenciales invalidas o rol no habilitado.
- Cliente solo lectura: puede quedar bloqueado por credenciales invalidas, rol o alcance.
- Pendiente: debe seguir bloqueado por diseno.

## Alcance

- Revisar flujo de login y setup.
- Revisar configuracion local disponible de Supabase sin imprimir secretos.
- Inspeccionar usuarios/perfiles con cliente administrativo si existe `SUPABASE_SERVICE_ROLE_KEY`.
- Identificar si el problema es password, usuario inexistente, email no confirmado, rol o configuracion de produccion.
- Aplicar correccion minima segura.

## Fuera de alcance

- Cambiar el modelo de roles.
- Desactivar seguridad o RLS.
- Exponer, registrar o compartir credenciales.

## Criterios de aceptacion

- Se identifica la causa probable o confirmada del bloqueo.
- La cuenta requerida queda habilitada o se define un procedimiento seguro de reseteo.
- `pending` sigue sin acceso operativo.
- Si hay cambio de codigo, pasa `npm run lint` y `npm run build`.

## Diseno funcional

El login debe aceptar usuarios existentes con contrasena valida y rol operativo. Las cuentas sin rol autorizado deben recibir bloqueo operativo despues de autenticar, no confundirse con credenciales invalidas.

## Diseno tecnico

- Rutas: `/login`, `/setup`, rutas protegidas bajo dashboard.
- Componentes: `LoginForm`, `SetupAdminForm`.
- API: `/api/users`, `/api/users/[id]/password`.
- Base de datos: `profiles`, `auth.users`.
- RLS/seguridad: mantener `admin`, `operator`, `client_readonly` habilitados y `pending` bloqueado.
- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Documentacion: actualizar si aparece procedimiento de recuperacion.

## Datos y migracion

Puede requerir actualizar password, confirmacion de email o rol de un usuario existente. No se debe migrar schema salvo que el diagnostico lo exija.

## Riesgos

- Resetear una cuenta equivocada.
- Elevar privilegios sin validar la necesidad operativa.
- Confundir bloqueo por rol con credenciales invalidas.

## Plan de QA

- Confirmar estado de usuario/perfil.
- Confirmar respuesta de produccion en `/login`.
- Si se cambia codigo: `npm run lint` y `npm run build`.
- Si se cambia password o rol: confirmar que el usuario pueda iniciar sesion con el nuevo dato compartido fuera de logs.

## Resultado

- Estado final: en revision
- Evidencia: el proyecto Supabase `rbopvzwqcgnwtwwmptxr` estaba `INACTIVE`; se restauro y quedo `ACTIVE_HEALTHY`. El host de Supabase responde y `/login` en Vercel responde 200. Luego el navegador reporto `Failed to fetch`, lo que apunta a conectividad/configuracion del cliente Supabase mas que a credenciales invalidas.
- Pendientes: validar llamada Auth con anon key, revisar configuracion embebida en frontend publicado y confirmar si requiere redeploy.
