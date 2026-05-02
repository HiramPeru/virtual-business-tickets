# Guia de Operacion

## URLs

- Produccion: https://virtual-business-tickets.vercel.app
- Setup inicial: https://virtual-business-tickets.vercel.app/setup
- Login: https://virtual-business-tickets.vercel.app/login
- Tickets: https://virtual-business-tickets.vercel.app/tickets
- Clientes: https://virtual-business-tickets.vercel.app/customers

## Primer Admin

1. Entrar a `/setup`.
2. Registrar nombre, email y contrasena.
3. Si no existe ningun perfil en `profiles`, Supabase crea el perfil con `role = 'admin'`.
4. Si ya existe un perfil, `/setup` queda cerrado.
5. Si Supabase exige confirmacion de correo, confirmar el email antes de entrar.
6. Ingresar por `/login`.

## Alta de Usuarios

- Los usuarios creados despues del primer admin quedan con `role = 'pending'` si no los habilita un admin.
- Un perfil `pending` no puede leer ni modificar datos operativos.
- Un admin puede crear usuarios desde `Usuarios`.
- El rol `operator` opera tickets y clientes internos.
- El rol `client_readonly` se vincula a un cliente principal y solo ve su historico.

## Clientes Principales

- `Clientes principales` agrupa empresas atendidas por Virtual Business.
- WOW Perú queda creado como cliente principal inicial.
- Cada empresa cliente debe asociarse a un cliente principal.

## Uso Diario

### Crear Cliente

1. Ir a `Clientes`.
2. Usar `Nuevo cliente`.
3. Registrar email obligatorio, nombre, empresa, RUC y telefono si aplica.

Tambien se puede crear un cliente desde `Nuevo ticket` usando el bloque `Nuevo cliente`.

### Crear Ticket

1. Ir a `Tickets`.
2. Seleccionar `Nuevo ticket`.
3. Buscar cliente por email o nombre.
4. Completar categoria, plataforma, prioridad, asunto y descripcion.
5. Guardar. La app redirige al detalle del ticket.

### Gestionar Ticket

En el detalle se puede:

- Cambiar estado.
- Cambiar prioridad.
- Asignar tecnico.
- Editar categoria, plataforma, subcategoria, asunto y descripcion.
- Agregar comentarios internos o marcados como visibles para cliente futuro.
- Revisar historial automatico de creacion, estado, prioridad y asignacion.

## Estados

- `New`: recien creado.
- `Assigned`: asignado a un tecnico.
- `In Progress`: en atencion.
- `Pending Customer`: esperando informacion del cliente.
- `Resolved`: resuelto tecnicamente.
- `Closed`: cerrado operativamente.

## Prioridades

- `Critical`: impacto alto o urgencia inmediata.
- `High`: importante, requiere atencion pronta.
- `Medium`: prioridad normal.
- `Low`: consulta o tarea no urgente.

## Reglas Operativas

- El ticket se crea manualmente. No hay ingestion automatica de correo en esta v1.
- El cliente debe existir como contacto antes de crear el ticket, aunque puede crearse durante el alta del ticket.
- No se debe cambiar el codigo del ticket.
- El cierre debe usarse cuando el caso ya no requiere accion.
- Los comentarios `customer_visible` estan preparados para portal futuro; por ahora siguen dentro del panel tecnico.
