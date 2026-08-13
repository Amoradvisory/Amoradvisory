# Portfolio Conversion V2 — Design

## Décision

Transformer le portfolio statique existant en parcours de conversion orienté décideur, puis ajouter une adaptation web autonome et fonctionnelle de PiloteCours dans le même déploiement GitHub Pages.

La mission utilisateur constitue le design métier approuvé. Les choix techniques réversibles sont arbitrés ici selon `impact × vitesse × crédibilité × simplicité`.

## Approches évaluées

### 1. Convertir l’application Android Kotlin

Rejetée. La transposition Compose vers le web serait lente, fragile et sans bénéfice visible pour un décideur.

### 2. Créer une application React, Vue ou Svelte séparée

Rejetée. Elle ajouterait une chaîne de build, des dépendances et un second système visuel pour une V1 qui n’en a pas besoin.

### 3. Étendre le site statique avec JavaScript modulaire

Retenue. HTML, CSS et modules JavaScript suffisent pour le parcours, la persistance locale, les tests Node et GitHub Pages. Cette option conserve une URL stable, un chargement rapide et une maintenance lisible.

## Proposition de valeur

**Je transforme des frictions pédagogiques concrètes en dispositifs simples, testables et responsables.**

Le hero associe immédiatement :

- `Amor El Hamrouni` ;
- `Enseignant & formateur — IA appliquée à l’éducation` ;
- la proposition de valeur ;
- une preuve de méthode : terrain, conception, prototypes, agents et automatisations lorsque pertinents ;
- deux actions : `Voir les démonstrateurs` et `Échanger`.

Le nom d’Amor reste dominant. `enseignant.be` n’est pas présenté comme une entreprise.

## Architecture de la homepage

1. **Hero** — identité, positionnement, valeur et deux CTA.
2. **Trois frictions** — observations perdues, séance difficile à piloter, mémoire pédagogique peu traçable.
3. **Trois preuves** — TeacherFlow, PiloteCours, Second cerveau, chacune structurée `problème → réponse → capacité → action`.
4. **Méthode** — `Observer → Cadrer → Concevoir → Orchestrer → Tester → Améliorer`.
5. **Contributions possibles** — formation et acculturation IA, conception pédagogique, prototypage, accompagnement de projet. Ce sont des capacités proposées, jamais des missions prétendument réalisées.
6. **Garde-fous** — IA utile, humain dans la boucle, données minimales, limites explicites.
7. **À propos** — enseignant et formateur, plusieurs terrains éducatifs, CAP, bachelier en marketing, IA appliquée depuis 2023, Belgique francophone.
8. **CTA final** — email et LinkedIn.
9. **Laboratoire** — lien GitHub discret pour les expérimentations secondaires ; aucun catalogue technique sur la homepage.

Les deux points de contact email visibles sont volontaires : le CTA `Échanger` du hero et le lien `Email` du CTA final. Ils utilisent tous deux la même adresse canonique ; aucun autre `mailto:` n’est ajouté.

## PiloteCours web

### URL

`/demos/pilotecours/`

### Fichiers

- `site/demos/pilotecours/index.html` — coque sémantique et contenu de secours.
- `site/demos/pilotecours/pilotecours.js` — modèle métier pur : phases, recadrages, état, navigation et normalisation.
- `site/demos/pilotecours/app.js` — rendu DOM, événements et persistance `localStorage`.
- `site/demos/pilotecours/styles.css` — interface mobile-first et mode discret.
- `site/demos/pilotecours/manifest.webmanifest` — métadonnées web app sans promesse d’installation non testée.
- `site/demos/pilotecours/icon.svg` — favicon et identité visuelle locale sobre.

### Parcours

- accueil avec `Commencer` ;
- `Reprendre` uniquement lorsqu’une phase a été enregistrée ;
- accès immédiat à `Recadrage rapide` et `Mode discret` ;
- phases ordonnées : `Avant d’entrer`, `0–15 min`, `15–45 min`, `45–120 min`, `Fin de séance` ;
- navigation précédent, suivant et accueil ;
- taille de texte persistée ;
- favoris de recadrages persistés ;
- mode discret très sombre avec grands contrôles ;
- aucune donnée élève, aucun compte, aucun backend, aucune API et aucune collecte.

### État local

Clé : `pilotecours-web-v1`.

```js
{
  currentView: "home" | "phase" | "recadrages" | "discreet",
  currentPhaseId: string,
  lastPhaseId: string | null,
  textScale: "normal" | "large" | "xlarge",
  favoriteReframes: string[],
  discreet: boolean
}
```

Toute valeur inconnue ou tout JSON invalide revient à un état sûr sans casser l’interface.

## Étude de cas PiloteCours

La page est réécrite autour de :

- friction ;
- hypothèse ;
- réponse ;
- bouton `Ouvrir la démo web` ;
- décisions : local-first, aucun compte, aucune donnée élève, interface courte, mode discret ;
- capacité démontrée : transformer une friction pédagogique en produit testable et piloter sa réalisation ;
- limites : démonstrateur, pas de déploiement institutionnel, pas de validation externe ni de mesure d’impact revendiquée.

## TeacherFlow et Second cerveau

TeacherFlow est présenté comme **« De l’observation fugace à la mémoire pédagogique »** avec la boucle `PRÉPARER → ENSEIGNER → OBSERVER → CAPITALISER → AMÉLIORER` et un lien direct vers la démo.

Le Second cerveau est présenté comme **« Transformer l’expérience pédagogique en mémoire cumulative »** et met au premier plan `SOURCE → INFÉRENCE → PROPOSITION`.

## Design

- palette institutionnelle navy, bleu, blanc et gris chaud ;
- grands espaces, typographie lisible, hiérarchie sobre ;
- aucune imagerie cyberpunk, robotique ou faussement futuriste ;
- cibles tactiles d’au moins 44 px ;
- focus clavier visible ;
- contenu accessible sans animation ;
- `prefers-reduced-motion` respecté ;
- mobile vérifié à 360, 390 et 412 px, puis desktop.

## SEO et partage

- titre : `Amor El Hamrouni — IA appliquée à l’éducation, formation & conception pédagogique` ;
- description orientée décideur ;
- Open Graph complet avec titre, description, type et URL ;
- favicon SVG ;
- sitemap incluant la démo PiloteCours.

## Tests

### Automatisés

- tests Node du modèle PiloteCours : ordre, navigation, normalisation, reprise, taille de texte et favoris ;
- validateur du site : fichiers attendus, métadonnées, liens internes, CTA email/LinkedIn, trois preuves et route PiloteCours ;
- vérification qu’aucune adresse non canonique, numéro de téléphone ou chemin local n’est publié.

### Navigateur

- parcours PiloteCours complet ;
- reprise après rechargement ;
- recadrages et favoris ;
- mode discret ;
- clavier et focus ;
- console ;
- absence de débordement à 360, 390, 412 et 1440 px ;
- liens publics TeacherFlow, PiloteCours, Second cerveau, LinkedIn et mailto.

## Publication

- branche `portfolio-conversion-v2` ;
- commits ciblés ;
- PR vers `main` ;
- fusion après contrôles verts ;
- workflow GitHub Pages ;
- relecture de la version publique, pas seulement locale.

## Brouillon Pierre Lelong

Après publication, vérifier le rôle et les voies de collaboration via des sources officielles actuelles. Réécrire un message de 150 à 180 mots maximum, conserver la signature Gmail existante, enregistrer le brouillon avec le statut documentaire `READY TO SEND` et ne pas l’envoyer.

## Non-objectifs

- aucun CV modifié ;
- aucun repository supprimé ou privatisé ;
- aucune API IA ajoutée ;
- aucune métrique, mission, adoption ou validation inventée ;
- aucun numéro de téléphone publié ;
- aucun email ou message LinkedIn envoyé.
