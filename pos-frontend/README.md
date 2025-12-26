# POS Frontend – Angular

Frontend del sistema POS + Inventario + Facturación electrónica (Ecuador).

---

## Tecnologías
- Angular 18+
- TypeScript
- PrimeNG
- PrimeIcons
- SCSS
- JWT Authentication

---

## Requisitos
- Node.js LTS
- NPM
- Angular CLI
- VS Code

---

## Instalación

Desde la carpeta del proyecto:

npm install

---

## Ejecutar el proyecto

Levantar servidor de desarrollo:

ng serve

Abrir en el navegador:

http://localhost:4200

---

## Conexión con Backend

El frontend consume la API en:

https://localhost:7096

(Configurado temporalmente en los servicios)

---

## Login de prueba (temporal)

Usuario: admin  
Password: 1234  

Este login es solo para validar la comunicación Front ↔ Back.

---

## Estructura del proyecto

src/app
- core
  - services
  - guards
  - interceptors
  - models
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

---

## Notas
- No se usan formularios reactivos aún
- No se usa JWT real todavía
- Seguridad completa se implementará en siguientes etapas
