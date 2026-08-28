@echo off
echo ==========================================
echo  Iniciando la interfaz web (SportsLeague.Web)
echo ==========================================
echo.

cd /d "%~dp0"

if not exist "SportsLeague.Web" goto :nofolder

node --version >nul 2>&1
if errorlevel 1 goto :nonode

cd SportsLeague.Web

if exist ".env.local" goto :afterenv
if not exist ".env.example" goto :afterenv
copy ".env.example" ".env.local" >nul

:afterenv
echo Instalando dependencias (la primera vez puede tardar unos minutos)...
call npm install
if errorlevel 1 goto :installfail

echo.
echo ==========================================
echo  Listo! Iniciando el servidor de la interfaz...
echo ==========================================
echo.
echo Cuando abajo veas una linea que dice algo como
echo "Local:   http://localhost:5173/", abre esa direccion
echo en tu navegador.
echo.
echo IMPORTANTE: deja esta ventana abierta mientras uses la pagina,
echo y no cierres la otra ventana donde esta corriendo la API (backend).
echo.
call npm run dev

pause
exit /b 0

:nofolder
echo ERROR: Este archivo debe estar dentro de la carpeta ITMSportsLeague, junto a la carpeta SportsLeague.Web
pause
exit /b 1

:nonode
echo ERROR: No se encontro "Node.js" en esta computadora.
echo Instala la version LTS desde https://nodejs.org (el instalador normal, "Recomendado para la mayoria").
echo Despues de instalarlo, cierra esta ventana, abre una nueva y vuelve a correr este archivo.
pause
exit /b 1

:installfail
echo.
echo ERROR: Hubo un problema instalando las dependencias. Copia este mensaje y compartelo con Claude.
pause
exit /b 1
