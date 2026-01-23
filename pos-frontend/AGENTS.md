# AGENTS.md

Este archivo define **reglas, estándares y flujos de trabajo** para que Codex (y cualquier colaborador) pueda trabajar correctamente en el frontend POS.

---

## Stack técnico

- Framework: Angular (standalone APIs)
- Lenguaje: TypeScript (tipado estricto)
- UI: PrimeNG + PrimeIcons
- Estilos: SCSS
- HTTP: HttpClient
- Estado: RxJS + Signals (cuando aplique)
- Auth: JWT (token en `localStorage`)

---

## Estructura real del repositorio

**NO cambiar la estructura sin ticket explícito.** La convención actual usa `modules/`, no `features/`.

```
pos-frontend/
 ├─ src/app/
 │   ├─ core/
 │   │   ├─ services/
 │   │   ├─ guards/
 │   │   ├─ interceptors/
 │   │   ├─ models/
 │   │   └─ stores/
 │   ├─ modules/
 │   │   ├─ auth/
 │   │   ├─ dashboard/
 │   │   ├─ inventario/
 │   │   ├─ ventas/
 │   │   ├─ pos/
 │   │   └─ sri/
 │   └─ shared/
 │       ├─ components/
 │       ├─ directives/
 │       └─ pipes/
```

---

## Principios obligatorios

- **Mantener la convención actual basada en `modules/`.**
- **Componentes delgados:** sin lógica de negocio pesada ni llamadas HTTP directas.
- **Servicios con lógica:** la lógica vive en `core/services` o en `services` dentro del módulo correspondiente.
- **Tipado estricto:** prohibido usar `any`.
- **Auth JWT:**
  - El interceptor agrega `Authorization: Bearer <token>`.
  - Las rutas protegidas usan `AuthGuard`.
- **Uso consistente de PrimeNG/PrimeIcons:** no mezclar librerías UI en este repo sin aprobación.
- **Backend URL centralizada o claramente documentada:**
  - Actualmente está en `src/app/core/services/auth.ts` (variable `api`).
  - Si se mueve a `environment`, debe documentarse de inmediato.

---

## Convenciones de nombres

- Componentes: `venta-list.component.ts`
- Servicios: `ventas.service.ts`
- Modelos/Interfaces: `venta.model.ts`
- Rutas y módulos deben reflejar el dominio (`modules/ventas`, `modules/inventario`, etc.).

---

## Tests y calidad

- Tests mínimos para servicios y componentes críticos.
- Framework actual: Angular CLI (Jasmine/Karma si aplica en el proyecto).
- Mantener consistencia con el resto del código.

---

## Comandos comunes

```bash
npm install
ng serve
ng build
ng test
```

---

## Cómo debe trabajar Codex en este repo

- **Un PR por ticket.**
- **No refactor masivo.**
- **No cambiar la estructura de carpetas** sin ticket explícito.
- **No romper código existente.**
- **Siempre entregar pasos de prueba** (ejemplo: `ng build`, `ng serve`).
- Explicar el enfoque cuando sea necesario y documentar decisiones importantes.

---

## Objetivo del proyecto

Construir un **POS sólido, mantenible y escalable**, priorizando:

- Claridad
- Seguridad
- Facilidad de evolución
- Aprendizaje del equipo

Este archivo es obligatorio y debe respetarse en cada cambio.
