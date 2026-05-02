# Checklist de Pruebas

## Build

```bash
npm run build
```

Debe terminar sin errores TypeScript.

## Autenticacion

- Abrir `/setup`.
- Crear primer admin.
- Confirmar que `/setup` queda cerrado despues de existir el primer perfil.
- Confirmar correo si Supabase lo solicita.
- Entrar por `/login`.
- Confirmar redireccion a `/tickets`.
- Cerrar sesion.
- Confirmar que `/tickets` redirige a `/login`.
- Probar que `/login?next=https://example.com` redirige a `/tickets`, no al dominio externo.

## Clientes

- Crear cliente principal `WOW Perú` o confirmar que existe.
- Crear cliente desde `/customers/new`.
- Asociar empresa a un cliente principal.
- Verificar que aparece en `/customers`.
- Crear cliente desde `/tickets/new` usando `Nuevo cliente`.
- Buscar cliente por email.
- Buscar cliente por nombre.

## Tickets

- Crear ticket con cliente existente.
- Crear ticket con cliente nuevo.
- Verificar codigo automatico `T-YYYYMMDD-0001`.
- Probar filtros por estado, prioridad, categoria y plataforma.
- Abrir detalle.
- Cambiar estado.
- Cambiar prioridad.
- Asignar tecnico.
- Editar descripcion.
- Confirmar que el historial registra cambios principales.

## Comentarios

- Agregar comentario interno.
- Agregar comentario marcado como visible para cliente futuro.
- Confirmar estilo diferenciado en el detalle.

## Perfil

- Cambiar nombre completo.
- Verificar que el nombre aparece en la cabecera y comentarios nuevos.
- Confirmar que no existe control UI para cambiar rol.

## Usuarios

- Crear un usuario `operator`.
- Crear un usuario `client_readonly` asociado a WOW Perú.
- Confirmar que `client_readonly` ve tickets de WOW Perú sin botones de crear, editar ni comentar.
- Confirmar que `client_readonly` no ve `Clientes`, `Clientes principales` ni `Usuarios`.

## Produccion

- Abrir https://virtual-business-tickets.vercel.app/login.
- Ingresar con usuario real.
- Crear un cliente de prueba.
- Crear un ticket de prueba.
- Cerrar o resolver el ticket de prueba.
