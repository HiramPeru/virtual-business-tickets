# Spec: SDD workflow

## Metadata

- Fecha: 2026-05-24
- Estado: verified
- Owner: Codex
- Rama/commit: pendiente
- Area: documentacion

## Problema

El proyecto tenia documentacion operativa y tecnica, pero no un protocolo explicito para convertir nuevas necesidades en cambios implementables y verificables. Esto aumenta el riesgo de cambios reactivos sin criterios de aceptacion claros.

## Objetivo

Establecer SDD como flujo de trabajo: cada cambio funcional importante debe empezar con una spec breve, revisarse contra alcance y cerrarse con evidencia de QA.

## Usuarios y roles afectados

- Admin: sin cambio directo en producto.
- Operador: sin cambio directo en producto.
- Cliente solo lectura: sin cambio directo en producto.
- Pendiente: sin cambio directo en producto.

## Alcance

- Crear guia SDD del proyecto.
- Crear carpeta `docs/specs/`.
- Crear plantilla reusable para nuevas specs.
- Enlazar SDD desde `README.md`.
- Registrar SDD en el roadmap como practica actual.

## Fuera de alcance

- Cambios en funcionalidad de la app.
- Automatizacion de validacion de specs.
- Cambios en CI/CD.

## Criterios de aceptacion

- Existe `docs/SDD.md`.
- Existe `docs/specs/TEMPLATE.md`.
- Existe `docs/specs/README.md`.
- `README.md` apunta a la documentacion SDD.
- `docs/ROADMAP.md` reconoce el flujo SDD.

## Diseno funcional

SDD queda definido como un flujo liviano: problema, objetivo, roles, alcance, criterios de aceptacion, diseno tecnico, datos, riesgos y QA.

## Diseno tecnico

- Rutas: no aplica.
- Componentes: no aplica.
- API: no aplica.
- Base de datos: no aplica.
- RLS/seguridad: no aplica.
- Variables de entorno: no aplica.
- Documentacion: `docs/SDD.md`, `docs/specs/README.md`, `docs/specs/TEMPLATE.md`, `README.md`, `docs/ROADMAP.md`.

## Datos y migracion

No afecta datos existentes.

## Riesgos

- Que SDD se vuelva demasiado pesado. Mitigacion: mantener specs cortas y accionables.
- Que cambios urgentes omitan spec. Mitigacion: permitir implementar rapido y registrar la spec inmediatamente despues.

## Plan de QA

- Revisar que los enlaces de documentacion apunten a archivos existentes.
- Confirmar que el arbol de git solo contiene cambios documentales.

## Resultado

- Estado final: verified
- Evidencia: archivos SDD creados y enlazados.
- Pendientes: aplicar esta plantilla en la proxima mejora funcional.
