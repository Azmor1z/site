# SecPlus Lab — Révision CompTIA Security+ SY0-701

Plateforme d'entraînement interactive conçue comme **complément pratique** au cours
théorique de Jason Dion sur Udemy. Le site suit **exactement l'ordre des 28 sections**
du cours et transforme chaque notion en exercices d'application ciblés sur la
mémorisation et sur les attentes réelles de l'examen.

## Ce que contient la plateforme

| Contenu | Volume |
|---|---|
| Sections du cours (ordre Dion) | 28 |
| Flashcards à répétition espacée | 467 |
| Questions QCM format examen | 270 |
| Exercices interactifs | 108 |
| Labs PBQ (mises en situation) | 12 (61 étapes) |
| Acronymes officiels CompTIA | 327 |
| Ports et protocoles | 40 |

Chaque section est mappée aux **objectifs officiels CompTIA SY0-701 v5.0**, et la
pondération des cinq domaines (12 / 22 / 18 / 28 / 20 %) est respectée dans les
examens blancs.

## Modes d'entraînement

- **Flashcards** — algorithme de répétition espacée inspiré de SM-2. Chaque carte
  est notée de « oublié » à « facile » et replanifiée en conséquence.
- **Quiz** — questions au format examen, avec explication détaillée précisant
  pourquoi la bonne réponse est bonne *et* pourquoi les autres sont fausses.
- **Mes erreurs** — rejoue uniquement les questions ratées la dernière fois.
- **Exercices** — quatre formats pour varier l'effort de mémorisation :
  association, tri par catégories (glisser-déposer), mise en ordre, texte à trous.
- **Labs PBQ** — scénarios à étapes reproduisant les *performance-based questions*
  qui ouvrent l'examen réel.
- **Examen blanc** — 90 questions en 90 minutes, grille de navigation, marquage
  des questions, score sur l'échelle 100–900 et correction détaillée par domaine.
- **Référence** — acronymes, ports et générateur illimité de calculs SLE / ARO / ALE.

## Architecture technique

Site **statique, sans build ni dépendance d'exécution** : HTML, CSS et JavaScript
classique organisés autour d'un espace de noms `App`. Ce choix garantit qu'il
fonctionne partout — serveur web, GitHub Pages, ou simple double-clic sur
`index.html` — sans étape de compilation susceptible de casser.

```
index.html
assets/
  css/app.css              Design system : thèmes clair/sombre, composants, responsive
  js/
    data/                  Contenu pédagogique (curriculum, flashcards, questions…)
    core/                  util, store (localStorage), srs (répétition espacée), ui
    views/                 Une vue par écran
    app.js                 Routeur par hash, navigation, recherche globale
```

La progression est enregistrée dans le `localStorage` du navigateur — aucune donnée
n'est transmise à un serveur. Elle est exportable et réimportable en JSON depuis la
page Statistiques.

## Utilisation

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
```

### Raccourcis clavier

| Touche | Action |
|---|---|
| `/` ou `Ctrl+K` | Recherche globale |
| `1` à `4` | Répondre en quiz, exercice ou examen |
| `Espace` | Retourner une flashcard |
| `→` / `Entrée` | Question suivante |
| `F` | Marquer une question pendant l'examen |

## Méthode d'utilisation recommandée

1. Visionner une section du cours Udemy.
2. Relire les **points clés** de la section correspondante, puis la marquer comme étudiée.
3. Enchaîner **flashcards → quiz → exercices** sur cette même section.
4. Revenir chaque jour sur la **Révision du jour** : c'est la répétition espacée qui
   ancre la mémorisation à long terme.
5. Une fois les 28 sections couvertes, passer des **examens blancs** et retravailler
   les domaines faibles signalés dans la correction.

## Sources

Contenu construit à partir des objectifs officiels *CompTIA Security+ SY0-701
Certification Exam Objectives v5.0* et du plan d'étude Dion Training, en suivant le
découpage en 28 sections du cours Udemy.
