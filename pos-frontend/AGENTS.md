# AGENTS.md

Este archivo define **reglas, estándares y flujos de trabajo** para que Codex (y cualquier colaborador) pueda trabajar correctamente en el proyecto POS.

---

## PARTE B — POS FRONTEND (ANGULAR)

### 1. Stack técnico

* Framework: Angular (especificar versión)
* Lenguaje: TypeScript
* Estilos: CSS / SCSS
* HTTP: HttpClient
* Estado: RxJS (no lógica pesada en componentes)

### 2. Principios obligatorios

* Arquitectura por **feature folders**
* Componentes delgados
* Servicios con toda la lógica de negocio
* No llamadas HTTP directas desde componentes

### 3. Estructura esperada

```
pos-frontend/
 ├─ src/app/
 │   ├─ core/
 │   │   ├─ services/
 │   │   ├─ guards/
 │   │   └─ interceptors/
 │   ├─ features/
 │   │   ├─ productos/
 │   │   │   ├─ pages/
 │   │   │   ├─ components/
 │   │   │   ├─ services/
 │   │   │   └─ models/
 │   │   ├─ ventas/
 │   │   └─ clientes/
 │   └─ shared/
 │       ├─ components/
 │       └─ pipes/
```

### 4. Convenciones

* Componentes: `producto-list.component.ts`
* Servicios: `productos.service.ts`
* Modelos: `producto.model.ts`
* Interfaces alineadas al backend

### 5. Comunicación con API

* Base URL centralizada en environment
* Manejo de errores en interceptor
* Respuestas mapeadas (no usar `any`)

### 6. Tests

* Tests mínimos para:

  * Servicios
  * Componentes críticos
* Framework: Jasmine / Karma

### 7. Comandos comunes

```bash
npm install
ng serve
ng build
ng test
```

---

## REGLAS PARA CODEX / IA

* Antes de escribir código: **explicar el enfoque**
* No romper código existente
* Mantener estilo y convenciones
* Agregar tests cuando aplique
* Explicar cada cambio importante
* Si hay duda: preguntar antes de asumir

---

## OBJETIVO DEL PROYECTO

Construir un **POS sólido, mantenible y escalable**, priorizando:

* Claridad
* Seguridad
* Facilidad de evolución
* Aprendizaje del desarrollador (Fernando)

Este archivo es obligatorio y debe respetarse en cada cambio.
