# Cockpit US — Suivi d'investissements actions US

Application locale de suivi de portefeuille (type Finary), construite autour du
mémo « Stratégie d'investissement actions US » de juillet 2026. Le portefeuille
cible (16 lignes, zones d'achat, stops, TP1, objectifs, poids) est pré-chargé.

> Analyse d'information et de méthode — pas un conseil en investissement.
> Cours à revérifier avant toute exécution.

## Démarrage rapide (Windows, sans terminal)

1. Installer [Node.js](https://nodejs.org/fr) (version LTS) — une seule fois.
2. Télécharger ce dépôt en ZIP et l'extraire où vous voulez (ex. `Bureau\outils`).
3. Double-cliquer **« Installer raccourci bureau.bat »** — crée l'icône
   *Cockpit US* sur le Bureau.
4. Double-cliquer l'icône **Cockpit US** : la première fois, tout s'installe
   automatiquement (2-4 min), puis l'app s'ouvre dans sa propre fenêtre.
   Les fois suivantes : quelques secondes.

`Arreter Cockpit US.bat` coupe le serveur (les données sont conservées).
Sur macOS : double-cliquer `lancer-cockpit-us.command`.

## Démarrage (terminal)

```bash
npm install
npm run dev        # http://localhost:3000
```

Ou en production locale :

```bash
npm run build && npm start
```

Au premier lancement, la base SQLite est créée dans `data/portfolio.db` et
seedée avec le mémo. Cliquez sur **« Rafraîchir les cours »** (dashboard) pour
récupérer les cotations et 2 ans d'historique via Yahoo Finance (aucune clé
API nécessaire), puis saisissez vos exécutions réelles dans **Transactions**.

## Fonctionnalités

- **Tableau de bord** : valeur, P&L latent/réalisé/du jour, exposition facteur
  IA vs ballast, allocation par bloc vs cibles, alertes et signaux par ligne
  (zone d'achat, stop, TP1, écrêtage 1,5×, règles +100 % et spéculatif -35 %).
- **Fiche par titre** : cours + MM50/MM200 + zone d'achat/stop/TP1/objectif sur
  le graphique, position (PRU, P&L), saisie des transactions, niveaux
  modifiables, stop « événement » du mémo.
- **Prédictions Monte Carlo** : 4 000 trajectoires GBM calibrées sur
  l'historique réel de chaque titre — cône de probabilités à 24 mois,
  P(TP1), P(objectif), P(stop touché) par horizon (3/6/12/24 mois), double
  dérive (historique / neutre).
- **DCA & Plan** : règle 60/40 calculée sur vos positions réelles, règle
  d'escalade (drawdown du bloc IA vs plus hauts 52 semaines), scénarios
  3/7 ans du mémo, garde-fous.
- **Checklist** : section 7 du mémo avec échéances (résultats, 13F, capex…).

## Notes

- Les données restent 100 % locales (`data/` est ignoré par git).
- Les cours passent par l'API non officielle Yahoo Finance : quasi temps réel,
  gratuit, mais sans garantie — toujours revérifier sur votre courtier.
