@echo off
setlocal
cd /d "%~dp0\.."

if not exist ".logs" mkdir ".logs"
echo.>> ".logs\responsive-preview.log"
echo [%date% %time%] Starting Responsive Preview Wall>> ".logs\responsive-preview.log"
"%~1" "node_modules\next\dist\bin\next" dev -p 3000 >> ".logs\responsive-preview.log" 2>&1
