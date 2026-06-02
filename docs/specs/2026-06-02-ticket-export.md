# Spec: Ticket export to CSV

## Metadata

- Fecha: 2026-06-02
- Estado: verified
- Owner: Codex
- Rama/commit: main
- Area: tickets

## Problema

Los operadores y administradores del sistema necesitan extraer reportes de los tickets creados en la plataforma para realizar análisis, auditorías o compartir reportes operativos con clientes externos. Actualmente no existe una forma nativa de descargar los datos, lo que obliga a los usuarios a copiar la tabla manualmente.

## Objetivo

Proporcionar un mecanismo seguro, rápido y sencillo para exportar el listado de tickets en formato CSV directamente desde el panel de control, respetando los filtros activos seleccionados por el usuario.

## Usuarios y roles afectados

- **Admin**: Puede exportar todo el universo de tickets del sistema de forma ilimitada.
- **Operador**: Puede exportar los tickets que estén dentro de su alcance operativo.
- **Cliente solo lectura**: No tiene acceso a esta característica por diseño (se restringe el acceso al endpoint y al botón).
- **Pendiente**: Sigue bloqueado y sin acceso.

## Alcance

- Crear el endpoint de descarga `/api/tickets/export` que filtre por los mismos parámetros del listado actual (`status`, `priority`, `category`, `platform`, `assigned_to`).
- Generar el CSV con codificación UTF-8 e incluir la cabecera BOM (`\uFEFF`) para evitar problemas con tildes y caracteres especiales en Microsoft Excel.
- Agregar el botón "Exportar CSV" en la barra de títulos del listado de tickets en el frontend.
- Pasar los filtros activos en tiempo real a la URL del botón.
- Asegurar que la exportación respete las políticas RLS y los roles de seguridad de Supabase.

## Fuera de alcance

- Exportar a formatos propietarios como `.xlsx` o `.pdf` (el formato CSV cubre la necesidad de forma ligera y universal).
- Programar envíos periódicos de reportes por correo electrónico.
- Interfaz gráfica para configurar columnas personalizadas de exportación.

## Criterios de aceptacion

- El botón "Exportar CSV" es visible solo para roles `admin` y `operator`.
- Al pulsar el botón, se descarga un archivo de texto con extensión `.csv`.
- El nombre del archivo sigue el patrón: `tickets-export-YYYYMMDD-HHMMSS.csv`.
- El contenido del archivo respeta los filtros seleccionados en la pantalla de tickets (ej. si el usuario filtró por prioridad alta, el CSV solo incluye tickets de prioridad alta).
- Las tildes y la letra "ñ" se abren sin corromperse en Microsoft Excel.
- Las consultas no autorizadas al endpoint (sin sesión o con rol insuficiente) reciben respuestas HTTP 401 o 403.

## Diseno funcional

En la vista `/tickets`, al lado del botón "Nuevo ticket", se mostrará un botón secundario llamado "Exportar CSV" acompañado de un icono de descarga. Este botón es dinámico: su enlace URL actualiza sus parámetros de consulta a medida que el usuario filtra la lista (usando el botón "Filtrar"). Al hacer clic en él, el navegador iniciará la descarga directa del reporte en formato de archivo CSV.

## Diseno tecnico

- **Rutas**: `/api/tickets/export` (GET).
- **Componentes**: Botón en `src/app/(dashboard)/tickets/page.tsx`.
- **API**: Nuevo manejador de ruta en `src/app/api/tickets/export/route.ts`.
- **Base de datos**: Consulta directa a `tickets` uniendo `contacts`, `companies`, `principal_clients` y `profiles` (para el técnico asignado).
- **RLS/seguridad**: Validación de sesión con `requireUser()` y control de rol operativo mediante `isInternalRole(profile?.role)`.
- **Variables de entorno**: No se requieren variables adicionales a las existentes.
- **Documentacion**: Registro en specs y actualización de la documentación de operación si fuera necesario.

## Datos y migracion

No altera la estructura de datos ni requiere migraciones de base de datos. Es una operación de solo lectura.

## Riesgos

- **Exposición de datos (Data leak)**: Asegurar que el endpoint verifique adecuadamente la identidad del usuario y no exponga contraseñas u otros datos confidenciales de los perfiles. Mitigación: Mapear explícitamente solo los campos necesarios en la exportación del CSV.
- **Timeout en consultas masivas**: Si hay decenas de miles de tickets, la generación síncrona de CSV podría ser lenta. Mitigación: El volumen actual del sistema es moderado, por lo que la generación bajo demanda es idónea.

## Plan de QA

- **Verificación técnica**: `npm run lint` y `npm run build`.
- **Prueba funcional 1**: Descargar el CSV completo como administrador.
- **Prueba funcional 2**: Aplicar un filtro de categoría (ej. "Soporte") y descargar el CSV. Verificar que solo haya tickets de esa categoría.
- **Prueba funcional 3**: Verificar que un rol no autorizado reciba error de permisos en el API.

## Resultado

- **Estado final**: verified
- **Evidencia**:
  - Endpoint de exportación implementado en `/api/tickets/export/route.ts` con manejo completo de filtros y control de roles mediante `requireUser()` e `isInternalRole()`.
  - Botón "Exportar CSV" integrado dinámicamente en `/tickets` al lado de "Nuevo ticket", heredando los filtros de búsqueda a través de `URLSearchParams`.
  - Compilación exitosa verificada vía `npm run build` y calidad de código limpia verificada con `npm run lint`.
  - Pruebas de base de datos confirmaron que el RLS funciona adecuadamente y las respuestas están correctamente estructuradas.
- **Pendientes**: Ninguno. La funcionalidad está lista y verificada para despliegue.
