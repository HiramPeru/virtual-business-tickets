# Roadmap

## V1 Actual

- Sistema interno para tecnicos.
- Entrada manual de tickets.
- Clientes, tickets, comentarios e historial.
- Primer admin via `/setup`.
- Supabase RLS basico para usuarios autenticados.
- Deploy en Vercel.

## Mejoras Prioritarias

1. Adjuntos con Supabase Storage.
2. Dashboard operativo: abiertos, vencidos, por tecnico y por plataforma.
3. SLA y fechas objetivo por prioridad.
4. Notificaciones por email.
5. Invitacion/alta controlada de tecnicos desde admin.
6. Auditoria mas completa de cambios de campos.
7. Busqueda global por codigo, asunto, cliente y descripcion.

## Futuro

- Portal de cliente.
- Comentarios realmente visibles para cliente.
- Ingestion de correo o integracion con buzones.
- Integracion WhatsApp.
- Exportacion Excel/CSV.
- Reporte mensual por cliente y plataforma.
- Roles mas granulares.

## Deuda Tecnica

- Persistir variables de Vercel desde dashboard para no pasarlas por CLI en cada despliegue.
- Agregar tests automatizados para APIs principales.
- Definir politica de backups y retencion.
- Revisar dependencias con `npm audit` antes de uso productivo amplio.
