# Barber SaaS - Plataforma Multi-Tenant para Barberías y Estéticas

![Barber SaaS](https://img.shields.io/badge/Status-Beta-success) ![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E) ![Angular](https://img.shields.io/badge/Angular-Admin_Panel-DD0031) ![Next.js](https://img.shields.io/badge/Next.js-Booking_Portal-black)

## Visión General
Barber SaaS es una plataforma Integral de Marca Blanca (White-label) altamente escalable desarrollada para la gestión de estéticas, peluquerías y barberías. El sistema utiliza una arquitectura multi-inquilino (multi-tenant), asegurando que cada comercio tenga sus datos estrictamente aislados y su identidad visual propia.

## Stack Tecnológico
* **Backend**: NestJS (Node.js) + TypeScript
* **Frontend Interno (Admin Panel)**: Angular 18 (Standalone Components, SCSS)
* **Frontend Público (Booking)**: Next.js 15 (App Router, Tailwind CSS v4, Glassmorphism)
* **Base de Datos & ORM**: PostgreSQL + Prisma ORM
* **Autenticación**: Supabase Auth con control de roles (RBAC)
* **Estructura**: NPM Workspaces (Monorepo)

## Arquitectura Multi-Tenant
La separación entre inquilinos (Estéticas) se maneja a nivel lógico (`esteticaId`):
1. **Detección**: El `TenantInterceptor` de NestJS captura el `esteticaId` desde el header (`x-tenant-id`) o desde el token JWT del usuario.
2. **Aislamiento Automático**: El `PrismaService` implementa una extensión (Prisma Client Extension) que inyecta `WHERE esteticaId = currentTenant` en cada consulta de forma nativa.
3. **Roles Controlados**: Sólo los miembros con rol `DUEÑO` o `EMPLEADO` pueden operar el Dashboard Administrativo.

## Estructura del Monorepo
```text
/barber-saas
  /apps
    /api                 # Backend NestJS: Autenticación, Empleados, Servicios, Citas.
    /admin-panel         # Frontend Angular: Login UI, Layout Dashboard, Sidebar interactivo.
    /booking-portal      # Frontend Next.js: Landing pública SEO-friendly y Formulario de Reservaciones multi-paso.
  /packages
    /database            # Prisma Schema, Migraciones y Seeders (seed.ts).
  package.json           # Workspaces config
```

## Estado Actual de Desarrollo 🚀

Hemos finalizado la Fase 1 (Arquitectura Base), que incluye:

- [x] **Base de Datos**: Esquema Prisma construido (`Estetica`, `Usuario`, `Servicio`, `Cita`).
- [x] **Backend (NestJS)**: 
  - Módulo Global de Autenticación con `@supabase/supabase-js`.
  - Guards (`SupabaseAuthGuard`) y Tenant Interceptors.
  - Endpoints CRUD creados y protegidos para **Citas, Servicios y Empleados**.
- [x] **Frontend Administrativo (Angular)**: 
  - UI interactiva del Login con Reactive Forms y SCSS Premium.
  - Layout del Dashboard con Menú Lateral (Sidebar) y Navbar superior.
- [x] **Frontend de Reservas (Next.js)**: 
  - Landing Page moderna diseñada con Tailwind v4 (Colores dinámicos, Glassmorphism).
  - Web App Flow de Reservas compuesto de 3 Pasos (Elegir Servicio -> Horario -> Confirmar Datos).
  - Wrapper Cliente API configurado para conectar con NestJS.
- [x] **Script de Seeding**: Archivo `packages/database/prisma/seed.ts` configurado para poblar la DB con un Super Admin, un Tenant de prueba y servicios básicos al instante de desplegar.

## Próximos Cambios a Futuro (Roadmap V1) 🗺️

Para poder desplegar la primera versión Alfa a producción, los siguientes pasos están listos para ser trabajados:

1. **Integración con DB en la Nube:**
   - Crear el proyecto en Supabase/Neon.
   - Insertar el `DATABASE_URL` y secretos en los archivos `.env`.
   - Ejecutar la mutación a la base de datos: `npx prisma db push` y luego vaciar los datos de prueba con `npm run db:seed`.

2. **Conexión API <-> Frontend:**
   - Conectar los botones del **Admin Panel (Angular)** reales hacia los Endpoints de NestJS (reemplazar mockups del Dashboard).
   - Enganchar el Botón de "Confirmar Reserva" del **Next.js** hacia nuestro endpoint de `POST /citas`.

3. **Autenticación Frontend JWT:**
   - Suscribir a Angular al Listener de Sesión de Supabase (Refrescar JWTs y guardarlos en LocalStorage/Cookies).
   
4. **Despliegues (CI/CD):**
   - Configurar Vercel para Next.js.
   - Configurar Render / Railway para alojar la API de NestJS y el panel de Angular.
