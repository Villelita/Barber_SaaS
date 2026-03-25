# Barber SaaS - Plataforma Multi-Tenant para Barberías y Estéticas

## Visión General
Barber SaaS es una plataforma Integral de Marca Blanca (White-label) desarrollada para la gestión de estéticas, peluquerías y barberías. El sistema utiliza una arquitectura multi-inquilino (multi-tenant) altamente escalable, asegurando que cada comercio tenga sus datos estrictamente aislados y su identidad visual propia.

## Stack Tecnológico
* **Backend**: NestJS (Node.js)
* **Frontend Interno (Admin Panel)**: Angular (Dueños, Empleados)
* **Frontend Público (Booking)**: Next.js (Clientes)
* **Base de Datos & ORM**: PostgreSQL + Prisma ORM
* **Autenticación**: Supabase Auth con control de roles (RBAC)
* **Gestor de Paquetes/Estructura**: NPM Workspaces (Monorepo)

## Estructura del Proyecto (Monorepo)
```text
/barber-saas
  /apps
    /api                 # Backend NestJS (Lógica principal, Guard de auth, Interceptores Tenant)
    /admin-panel         # Frontend Angular para la gestión de sucursales (Dashboards, CRUD, Citas)
    /booking-portal      # Frontend Next.js SEO-friendly para clientes
  /packages
    /database            # Esquema centralizado de Prisma y migraciones de DB
  package.json           # Workspaces config (npm workspaces)
```

## Arquitectura Multi-Tenant
La separación entre inquilinos (Estéticas) se maneja a nivel lógico (`esteticaId`):
1. **Detección**: El `TenantInterceptor` de NestJS captura el `esteticaId` desde el header (`x-tenant-id`) o desde el token JWT del usuario.
2. **Aislamiento**: El `PrismaService` implementa una extensión (Prisma Client Extension) que inyecta automáticamente `WHERE esteticaId = currentTenant` en cada consulta. 
Esto garantiza que los datos de múltiples clientes jamás se crucen por error.

## Entidades Principales de la Base de Datos
* **Estetica**: El Tenant central (Nombre, Dominio, Logo, Colores).
* **Usuario**: Tabla global conectada a Supabase. Roles definidos: `SUPER_ADMIN`, `DUENO`, `EMPLEADO`, `CLIENTE`.
* **Cita**: Reservas que vinculan un `clienteId`, `empleadoId` y `servicioId`.
* **Servicio**: Catálogo particular y precios por estética.
* **EmpleadoServicio**: Reglas de comisión y capacidad por empleado.
* **Factura / Inventario**: Manejo financiero y de stock ligado al inquilino.

## Estado de Desarrollo (Registro Histórico)
1. **Planificación y Arquitectura**: Diseño de datos, Prisma schema y estrategia de NPM Workspaces aprobada.
2. **Inicialización Base**: 
   - Generación de Workspace `package.json`.
   - Inicialización del paquete genérico de Prisma.
   - Creación y configuración inicial del proyecto API en NestJS con Guards de Autenticación y Multi-Tenant Interceptors.
3. **Scaffolding de Frontends**:
   - Angular 18/17 CLI ejecutado para crear `admin-panel` en SCSS con standalone components y routing.
   - Next.js creado en `booking-portal` interactuando con Tailwind y App Router.
4. **Desarrollo Frontend Admin**:
   - Creación del Módulo/Componente Login en el Admin-Panel (En Progreso).

## Próximos Pasos (Hoja de Ruta)
1. Terminar flujo de autenticación JWT / Auth con Auth UI.
2. Conectar Prisma Client localmente contra un Supabase o Postgres cloud y ejecutar migraciones (`prisma db push`).
3. Crear Endpoints básicos en NestJS para que Angular los consuma en el Admin Dashboard.
4. Diseñar portal de booking público usando Next.js + Calendario interactivo.
