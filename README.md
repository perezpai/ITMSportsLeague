# SportsLeague

Sistema de gestión de una liga deportiva: equipos, jugadores, árbitros, torneos,
partidos, patrocinadores, estadísticas y tabla de posiciones.

- **SportsLeague.API** — API REST en ASP.NET Core (.NET 10) con arquitectura por capas.
- **SportsLeague.Domain** — entidades y lógica de negocio.
- **SportsLeague.DataAccess** — EF Core, repositorios, identidad (usuarios/roles).
- **SportsLeague.Web** — frontend en React + TypeScript + Vite.

## ⚠️ Antes de correr el proyecto por primera vez

Esta rama agrega autenticación (ASP.NET Core Identity + JWT). Como no fue posible
generar la migración de EF Core desde el entorno donde se preparó este cambio (sin
acceso a NuGet), **hay que crear la migración de las tablas de Identity antes de
levantar la API**:

```bash
dotnet tool install --global dotnet-ef   # si no lo tienes instalado
cd SportsLeague.DataAccess
dotnet ef migrations add AddIdentityTables --startup-project ../SportsLeague.API
```

La API aplica las migraciones automáticamente al arrancar (`context.Database.MigrateAsync()`),
así que no hace falta correr `dotnet ef database update` a mano.

## Configuración de secretos (backend)

El JWT necesita una clave secreta que **no debe subirse al repositorio**. Configúrala
con `dotnet user-secrets` dentro de `SportsLeague.API`:

```bash
cd SportsLeague.API
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "una-clave-larga-y-aleatoria-de-al-menos-32-caracteres"

# Opcional: para que se cree un usuario Admin la primera vez que corre la API
dotnet user-secrets set "Seed:AdminEmail" "admin@tudominio.com"
dotnet user-secrets set "Seed:AdminPassword" "UnaContraseñaSegura123"
```

Si no configuras `Seed:AdminPassword`, no se crea ningún usuario Admin automáticamente
— en ese caso regístrate desde el frontend (queda como rol `Viewer` por defecto) y pide
a alguien con acceso a la base de datos que te promueva a `Admin` en la tabla
`AspNetUserRoles`, o define el secreto y reinicia la API una vez.

En producción, estos mismos valores se configuran como variables de entorno
(`Jwt__Key`, `Seed__AdminEmail`, `Seed__AdminPassword`) o en el proveedor de secretos
que uses (Azure Key Vault, etc.) — nunca en `appsettings.json`.

## Roles

| Rol | Puede |
|---|---|
| `Admin` | Todo, incluyendo gestionar usuarios y roles (`/api/users`) |
| `Manager` | Crear/editar/eliminar equipos, jugadores, torneos, árbitros, patrocinadores y partidos |
| `Referee` | Registrar resultados, goles, tarjetas, alineaciones y cambiar el estado de un partido |
| `Viewer` | Solo lectura (rol por defecto al registrarse) |

Las consultas (`GET`) son públicas y no requieren login, igual que antes de este
cambio — solo las operaciones de escritura requieren autenticación.

## Backend — cómo correr

```bash
cd SportsLeague.API
dotnet run
```

Por defecto queda disponible en `https://localhost:7169` (ver
`SportsLeague.API/Properties/launchSettings.json`) con Swagger en `/swagger`. Desde
Swagger, usa el botón **Authorize** pegando el token que te devuelve
`POST /api/auth/login`.

## Frontend — cómo correr

```bash
cd SportsLeague.Web
npm install
cp .env.example .env.local   # ajusta VITE_API_URL si tu API corre en otro puerto
npm run dev
```

Queda disponible en `http://localhost:5173`. Si cambias el puerto del frontend,
actualiza `Cors:AllowedOrigins` en `SportsLeague.API/appsettings.json` (o en
`appsettings.Development.json`) para que la API lo acepte.

Verificado en este entorno de preparación: `npm run build` compila sin errores de
TypeScript (`tsc -b && vite build`).

## Qué se agregó en esta rama

**Seguridad**
- Autenticación con JWT + ASP.NET Core Identity (usuarios, roles, contraseñas con hash).
- Roles `Admin` / `Manager` / `Referee` / `Viewer` aplicados con `[Authorize]` en cada
  endpoint de escritura (antes cualquiera podía crear/editar/borrar cualquier cosa).
- Middleware global de manejo de errores: nunca se exponen stack traces ni mensajes
  internos de EF/SQL al cliente.
- Validación de datos de entrada (`DataAnnotations`) en todos los DTOs de request:
  campos obligatorios, longitudes máximas, formatos de email/teléfono/URL, rangos
  numéricos y reglas cruzadas (ej. fecha fin de torneo no puede ser anterior a la de inicio).
- CORS restringido a los orígenes configurados (el frontend), en vez de abierto a todos.
- Rate limiting: límite global por IP y un límite más estricto en login/registro para
  dificultar ataques de fuerza bruta.
- Enums serializados como texto (`"Scheduled"` en vez de `0`) para que la API sea más
  legible y difícil de usar mal desde el frontend.

**Funcionalidades nuevas**
- Registro/login/perfil (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- Gestión de usuarios y roles para administradores (`/api/users`).
- Endpoint de resumen para el dashboard (`/api/dashboard/summary`): conteos generales
  y próximos partidos programados.

**Interfaz**
- Aplicación web nueva (`SportsLeague.Web`) en React + TypeScript: login/registro,
  dashboard, tabla de posiciones/goleadores/tarjetas, calendario de partidos con
  cambio de estado, y gestión CRUD de equipos, jugadores, árbitros, patrocinadores y
  torneos — todo respetando los roles del usuario logueado (los botones de crear/editar/
  eliminar solo aparecen si el usuario tiene permiso).

## Próximas fases sugeridas

Quedó fuera de esta primera entrega por alcance, para no bloquear la revisión:
estadísticas/reportes más avanzados (exportar a Excel/PDF, rendimiento histórico),
notificaciones por email de partidos próximos, y un panel de auditoría de cambios.
