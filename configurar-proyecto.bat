@echo off
echo ==========================================
echo  Configurando ITMSportsLeague
echo ==========================================
echo.

cd /d "%~dp0"

if not exist "SportsLeague.slnx" goto :nosln

dotnet --version >nul 2>&1
if errorlevel 1 goto :nodotnet

echo Configurando los secretos del proyecto (clave de login)...
cd SportsLeague.API
dotnet user-secrets init
if errorlevel 1 goto :secretsfail
dotnet user-secrets set "Jwt:Key" "zgCVY_UlDHGTU5YoP3Qn1tmeiUmqgyxBacE_4OFft6i_MiXhiopkWD8XlRizvnbr"
if errorlevel 1 goto :secretsfail
dotnet user-secrets set "Seed:AdminEmail" "admin@sportsleague.local"
if errorlevel 1 goto :secretsfail
dotnet user-secrets set "Seed:AdminPassword" "JQldvRrHnrWa46GhhStK"
if errorlevel 1 goto :secretsfail
cd ..

echo.
echo ==========================================
echo  Listo! El proyecto ya quedo configurado.
echo ==========================================
echo.
echo La migracion de la base de datos (tablas de usuarios y roles) ya viene
echo lista dentro del proyecto, asi que no hace falta generarla en este PC.
echo.
echo Para entrar por primera vez, usa esta cuenta de administrador:
echo   Email:      admin@sportsleague.local
echo   Contrasena: JQldvRrHnrWa46GhhStK
echo (Te recomiendo cambiarla mas adelante desde la pantalla de Usuarios.)
echo.
echo Ahora abre SportsLeague.slnx en Visual Studio y corre el proyecto (F5)
echo con el perfil "https".
echo.
pause
exit /b 0

:nosln
echo ERROR: Este archivo debe estar dentro de la carpeta ITMSportsLeague, junto a SportsLeague.slnx
pause
exit /b 1

:nodotnet
echo ERROR: No se encontro "dotnet" en esta computadora.
echo Instala el .NET 10 SDK desde https://dotnet.microsoft.com/download/dotnet/10.0
echo o instala Visual Studio con la carga de trabajo "Desarrollo web y ASP.NET".
pause
exit /b 1

:secretsfail
echo.
echo ERROR: Hubo un problema configurando los secretos. Copia este mensaje y compartelo con Claude.
pause
exit /b 1
