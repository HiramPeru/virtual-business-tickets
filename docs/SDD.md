# Spec Driven Development

Este proyecto se trabaja bajo SDD: ningun cambio funcional importante debe empezar directamente en codigo sin una especificacion breve y verificable.

## Objetivo

Mantener una linea clara entre necesidad operativa, decision de producto, implementacion tecnica y verificacion. La spec es la fuente de verdad del cambio mientras esta en curso.

## Flujo

1. Crear o actualizar una spec en `docs/specs/`.
2. Definir el problema, alcance, fuera de alcance y criterios de aceptacion.
3. Revisar impacto tecnico: rutas, componentes, API, base de datos, seguridad y documentacion.
4. Implementar solo lo que la spec cubre.
5. Verificar con comandos locales y, si aplica, prueba manual en produccion.
6. Actualizar la spec con estado final, decisiones y evidencias.

## Estados

- `draft`: idea capturada, aun no lista para implementar.
- `approved`: lista para desarrollo.
- `in_progress`: en implementacion.
- `verified`: implementada y verificada.
- `deferred`: aplazada.
- `cancelled`: descartada.

## Reglas

- Una spec debe ser corta, concreta y accionable.
- Si aparece un cambio nuevo durante la implementacion, se agrega a la spec o se abre otra.
- Los cambios de base de datos deben indicar migracion, RLS, datos existentes y rollback operativo.
- Los cambios de permisos deben describir roles afectados: `admin`, `operator`, `client_readonly`, `pending`.
- Los cambios visibles deben incluir criterios de QA manual.
- Las correcciones urgentes pueden implementarse rapido, pero la spec debe registrarse inmediatamente despues.

## Convencion de nombres

Usar:

```text
docs/specs/YYYY-MM-DD-slug.md
```

Ejemplo:

```text
docs/specs/2026-05-24-ticket-export-csv.md
```

## Checklist antes de codificar

- Problema definido.
- Usuario o rol afectado identificado.
- Alcance y fuera de alcance claros.
- Criterios de aceptacion medibles.
- Riesgos y datos afectados revisados.
- Plan de QA definido.

## Checklist antes de publicar

- `npm run lint`
- `npm run build`
- QA manual segun la spec.
- Documentacion actualizada si cambia operacion, arquitectura, Supabase, Vercel, seguridad o roadmap.
- Commit con mensaje asociado al nombre de la spec.
