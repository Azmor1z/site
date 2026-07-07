@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\Cockpit US.lnk');" ^
  "$s.TargetPath='%~dp0Lancer Cockpit US.bat';" ^
  "$s.WorkingDirectory='%~dp0';" ^
  "$s.IconLocation='%~dp0app\favicon.ico';" ^
  "$s.WindowStyle=7;" ^
  "$s.Description='Suivi d''investissements actions US';" ^
  "$s.Save()"
if errorlevel 1 (
  echo Impossible de creer le raccourci.
) else (
  echo.
  echo  Raccourci "Cockpit US" cree sur le Bureau.
  echo  Double-cliquez dessus pour lancer l'application.
  echo.
)
pause
