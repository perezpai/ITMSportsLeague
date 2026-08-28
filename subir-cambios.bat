@echo off
echo ==========================================
echo  Subiendo los cambios de ITMSportsLeague
echo ==========================================
echo.

cd /d "%~dp0"

if not exist "SportsLeague.slnx" goto :nosln
if not exist "sportsleague-feature-branch.bundle" goto :nobundle

git --version >nul 2>&1
if errorlevel 1 goto :nogit

echo Descargando la rama nueva con los cambios...
git fetch "sportsleague-feature-branch.bundle" feature/security-ui-and-features:feature/security-ui-and-features
if errorlevel 1 goto :fetchfail

echo.
echo Subiendo la rama a GitHub... si te pide iniciar sesion, hazlo con tu cuenta de GitHub.
git push origin feature/security-ui-and-features
if errorlevel 1 goto :pushfail

echo.
echo ==========================================
echo  Listo! Ahora ve a:
echo  github.com/perezpai/ITMSportsLeague
echo  y haz clic en el boton amarillo "Compare and pull request"
echo ==========================================
pause
exit /b 0

:nosln
echo ERROR: Este archivo debe estar dentro de la carpeta ITMSportsLeague, junto a SportsLeague.slnx
echo Carpeta actual: %cd%
pause
exit /b 1

:nobundle
echo ERROR: No encuentro sportsleague-feature-branch.bundle en esta carpeta.
echo Debe estar junto a este .bat.
pause
exit /b 1

:nogit
echo ERROR: No se encontro "git" en esta computadora.
echo Instala Git para Windows o Visual Studio con Git incluido, y vuelve a intentar.
pause
exit /b 1

:fetchfail
echo.
echo Hubo un problema descargando la rama. Copia todo este mensaje y compartelo con Claude.
pause
exit /b 1

:pushfail
echo.
echo Hubo un problema subiendo la rama. Copia todo este mensaje y compartelo con Claude.
pause
exit /b 1
