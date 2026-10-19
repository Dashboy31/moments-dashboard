@echo off
chcp 65001 > nul
title Moments - Dashboard Operativo Salón de Eventos

echo ===================================================================
echo   MOMENTS · SALÓN DE EVENTOS FAMILIAR
echo   San Rafael, Mendoza — Sistema Operativo Central
echo ===================================================================
echo.

:: Asegurar Node.js en el PATH
set "PATH=C:\Users\Administrator\AppData\Local\Programs\nodejs;%PATH%"

:: Cambiar al directorio del script
cd /d "%~dp0"

:: Verificar si node_modules existe
if not exist "node_modules\" (
    echo [INFO] Primera ejecucion detectada. Instalando dependencias...
    call npm install
    echo [INFO] Compilando frontend interactivo...
    call npm run build
)

:: Verificar si dist existe
if not exist "dist\" (
    echo [INFO] Compilando interfaz web por primera vez...
    call npm run build
)

echo.
echo [1/2] Iniciando servidor y base de datos central de Moments...
echo [2/2] Abriendo el panel en su navegador...
echo.
echo ===================================================================
echo   Acceso Local (esta PC):     http://localhost:3060
echo   Acceso Celulares / Tablets: Conectarse al WiFi y abrir la IP local
echo   Pestaña Caja (Gerencia):    Clave PIN: 1234
echo ===================================================================
echo.
echo Mantenga esta ventana abierta mientras use el sistema.
echo Para salir o reiniciar, cierre esta ventana o presione Ctrl+C.
echo.

:: Abrir navegador tras 1 segundo
start "" "http://localhost:3060"

:: Iniciar servidor Node
node server/server.js
