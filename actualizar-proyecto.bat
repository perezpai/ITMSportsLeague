@echo off
echo ==========================================
echo  Actualizando ITMSportsLeague
echo ==========================================
echo.

cd /d "%~dp0"

if not exist "SportsLeague.slnx" goto :nosln

git --version >nul 2>&1
if errorlevel 1 goto :nogit

git config user.email >nul 2>&1
if errorlevel 1 git config user.email "perezpai@example.com"
git config user.name >nul 2>&1
if errorlevel 1 git config user.name "Perez Pai"

echo Guardando los archivos de la migracion que quedaron pendientes en tu PC...
git add -A
git commit -m "Agregar migracion de Identity generada localmente" >nul 2>&1

echo.
echo Descargando y combinando los cambios mas recientes desde GitHub...
git pull origin master --no-rebase --no-edit
if errorlevel 1 goto :pullfail

echo.
echo Subiendo la combinacion a GitHub, para dejar todo respaldado...
git push origin master
if errorlevel 1 goto :pushfail

echo.
echo ==========================================
echo  Listo! Tu carpeta ya quedo actualizada.
echo ==========================================
pause
exit /b 0

:nosln
echo ERROR: Este archivo debe estar dentro de la carpeta ITMSportsLeague, junto a SportsLeague.slnx
pause
exit /b 1

:nogit
echo ERROR: No se encontro "git" en esta computadora.
pause
exit /b 1

:pullfail
echo.
echo Hubo un problema descargando los cambios. Copia todo este mensaje y compartelo con Claude.
pause
exit /b 1

:pushfail
echo.
echo Tu carpeta ya se actualizo bien, pero hubo un problema subiendo el respaldo a GitHub.
echo No es grave, puedes seguir usando el proyecto igual. Copia este mensaje y compartelo con Claude.
pause
exit /b 1
