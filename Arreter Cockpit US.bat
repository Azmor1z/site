@echo off
setlocal
set "PORT=3179"
set "FOUND="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":%PORT% "') do (
  taskkill /f /pid %%a >nul 2>nul
  set "FOUND=1"
)
if defined FOUND (
  echo Cockpit US est arrete. Vos donnees sont conservees.
) else (
  echo Cockpit US n'etait pas en cours d'execution.
)
pause
