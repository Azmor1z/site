@echo off
setlocal
cd /d "%~dp0"
set "PORT=3179"
set "URL=http://localhost:%PORT%"
title Cockpit US

rem — Serveur deja lance ? On ouvre juste la fenetre.
netstat -ano | findstr "LISTENING" | findstr ":%PORT% " >nul 2>nul
if %errorlevel%==0 goto :open

rem — Node.js est-il installe ?
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js n'est pas encore installe sur ce PC ^(necessaire une seule fois^).
  echo  La page de telechargement va s'ouvrir : cliquez sur le bouton vert "LTS",
  echo  installez en faisant Suivant partout, puis relancez ce raccourci.
  echo.
  start https://nodejs.org/fr
  pause
  exit /b 1
)

if not exist node_modules (
  echo Premiere installation des composants, patientez 2-3 minutes...
  call npm install
  if errorlevel 1 ( echo Echec de l'installation. Verifiez votre connexion internet. & pause & exit /b 1 )
)

if not exist .next (
  echo Preparation de l'application, environ 1 minute...
  call npm run build
  if errorlevel 1 ( echo Echec de la preparation. & pause & exit /b 1 )
)

echo Demarrage de Cockpit US...
start "Cockpit US - serveur" /min cmd /c "set PORT=%PORT%&& npm start"

rem — Attendre que le serveur reponde (60 s max)
powershell -NoProfile -Command "for($i=0;$i -lt 120;$i++){try{$c=New-Object Net.Sockets.TcpClient('127.0.0.1',%PORT%);$c.Close();exit 0}catch{Start-Sleep -Milliseconds 500}};exit 1"
if errorlevel 1 ( echo Le serveur n'a pas demarre. Relancez ce raccourci. & pause & exit /b 1 )

:open
rem — Fenetre dediee (mode application, sans onglets) via Edge, sinon navigateur par defaut
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe" >nul 2>nul
if %errorlevel%==0 (
  start "" msedge --app=%URL%
) else (
  start "" %URL%
)
exit /b 0
