#!/bin/bash
# Lanceur macOS — double-cliquable depuis le Finder.
cd "$(dirname "$0")"
PORT=3179
URL="http://localhost:$PORT"

if lsof -i :$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  open "$URL"
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js n'est pas installé (nécessaire une seule fois)."
  echo "La page de téléchargement va s'ouvrir : installez la version LTS, puis relancez."
  open "https://nodejs.org/fr"
  read -r -p "Appuyez sur Entrée pour fermer..."
  exit 1
fi

[ -d node_modules ] || { echo "Première installation (2-3 minutes)..."; npm install || exit 1; }
[ -d .next ] || { echo "Préparation de l'application (1 minute)..."; npm run build || exit 1; }

echo "Démarrage de Cockpit US..."
PORT=$PORT nohup npm start >/dev/null 2>&1 &

for _ in $(seq 1 120); do
  if curl -s -o /dev/null "$URL"; then break; fi
  sleep 0.5
done

open "$URL"
