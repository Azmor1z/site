# Pjesme mora i kamena — knjižara / boutique

Site vitrine statique (HTML/CSS/JS, sans dépendance) pour la vente d'un livre de
chansons croates. Tout le contenu visible est en **croate** ; ce README est en
français pour la personnalisation.

> ⚠️ Le contenu actuel (titre, auteur, prix, chansons, avis, textes légaux) est
> **provisoire mais crédible**. Il sert de squelette prêt à l'emploi. Remplace-le
> par le vrai contenu quand tu me l'envoies.

## Structure

```
index.html                Page principale (produit + description + FAQ + achat)
o-autoru.html             Page « À propos / Auteur » (biographie)
pravila-privatnosti.html  Politique de confidentialité (GDPR)
uvjeti-kupnje.html        Conditions de vente / achat
kolacici.html             Politique de cookies
impressum.html            Mentions légales
assets/css/style.css      Design system complet (couleurs, typo, composants)
assets/js/main.js         Interactions (menu, scroll reveal, FAQ, achat…)
assets/img/               👉 Déposer ici les images produit
```

## 3 choses à faire pour mettre en ligne

### 1. Lien de paiement Stripe
Ouvre `assets/js/main.js` et colle ton lien Stripe dans **une seule** constante,
tout en haut du fichier :

```js
var STRIPE_URL = "https://buy.stripe.com/xxxxxxxx";
```

Dès que ce lien n'est plus vide, le bouton d'achat s'active automatiquement,
son texte devient « Kupi sada » et il redirige vers Stripe. Tant qu'il est vide,
le bouton reste désactivé avec la mention « Uskoro dostupno » (bientôt disponible).

### 2. Images produit
Dépose tes photos dans `assets/img/` puis remplace les blocs marqués
`media-ph` (placeholders « — uskoro ») par une vraie image. Exemple :

```html
<div class="split__media">
  <img src="assets/img/knjiga-1.jpg" alt="Knjiga Pjesme mora i kamena" />
</div>
```

Emplacements des placeholders images :
- `index.html` : couverture (hero, mockup CSS), photo du livre ouvert, photo auteur
- `o-autoru.html` : portrait de l'auteur

### 3. Contenu réel (croate)
Cherche/remplace ces valeurs provisoires :
- **Titre** : `Pjesme mora i kamena`
- **Auteur** : `Ivan Marić`
- **Prix** : `27,90 €` (et l'ancien prix `34,90 €`)
- **Chansons** : la liste dans la section `#sadrzaj` de `index.html`
- **Avis clients** : section `#recenzije`
- **Biographie** : `o-autoru.html`
- **Textes légaux** : les champs entre crochets `[…]` (raison sociale, OIB,
  adresse, e-mail, ISBN…) dans les 4 pages légales.

## Prévisualisation locale

Aucun build nécessaire. Ouvre `index.html` dans un navigateur, ou sers le dossier :

```bash
python3 -m http.server 8000   # puis http://localhost:8000
```

## Hébergement

100 % statique → déployable gratuitement sur GitHub Pages, Netlify ou Vercel
(glisser-déposer le dossier, aucune configuration serveur requise).

## Design

- Ambiance « chaleureux littéraire » : palette crème + terracotta, texture papier.
- Typographies : **Fraunces** (titres) + **Inter** (texte), via Google Fonts.
- Responsive, menu mobile, animations au défilement, respect de
  `prefers-reduced-motion`, données structurées SEO (schema.org Book).
