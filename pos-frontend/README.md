# POS Frontend – Angular

Frontend del sistema POS + Inventario + Facturación electrónica (Ecuador).

---

## Tecnologías

- Angular 21
- TypeScript
- PrimeNG + PrimeIcons
- SCSS
- Autenticación JWT (token en `localStorage`)

---

## Requisitos

- Node.js LTS
- npm (el repo usa `npm@11.x`)
- Angular CLI 21 (`npm install -g @angular/cli`)

---

## Instalación

Desde la carpeta del proyecto:

```bash
npm install
```

---

## Ejecutar el proyecto

Levantar servidor de desarrollo:

```bash
ng serve
```

Abrir en el navegador:

```
http://localhost:4200
```

---

## Scripts disponibles

```bash
ng build
ng test
```

---

## Conexión con Backend

- La URL base del backend **está definida actualmente** en `src/app/core/services/auth.ts`.
- Variable: `private api = 'https://localhost:7096/api/auth';`
- Si se migra a `environment`, documentar la nueva ubicación.

---

## Flujo de autenticación (estado actual)

1. **Login**: el componente de login ejecuta `AuthService.login('admin', '1234')` y guarda el `token` en `localStorage`.
2. **Contexto del usuario**: luego se llama a `/api/auth/me` mediante `AuthStore.loadMe()`.
3. **Interceptor**: agrega `Authorization: Bearer <token>` a cada request.
4. **Guard**: `AuthGuard` protege rutas verificando el token.

---

## Estructura del proyecto

```
src/app
- core
  - services
  - guards
  - interceptors
  - models
  - stores
- modules
  - auth
  - dashboard
  - inventario
  - ventas
  - pos
  - sri
- shared
  - components
  - pipes
  - directives
```

---

## Notas sobre PrimeNG / PrimeIcons

- Usar componentes PrimeNG de forma consistente.
- No mezclar otras librerías UI sin aprobación.

