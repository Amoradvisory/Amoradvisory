# Portfolio Conversion V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer le portfolio public en porte d’entrée décideur et publier une adaptation web mobile-first, locale et réellement fonctionnelle de PiloteCours.

**Architecture:** Le dépôt statique existant reste la source unique de GitHub Pages. PiloteCours est une route autonome en HTML/CSS/JavaScript modulaire ; la logique métier pure est testée avec `node:test`, tandis que le validateur du site contrôle les contrats éditoriaux, les routes et les liens publics.

**Tech Stack:** HTML5, CSS moderne, JavaScript ES modules, `node:test`, GitHub Pages, GitHub Actions.

## Global Constraints

- Le nom principal reste `Amor El Hamrouni`.
- Positionnement : enseignant & formateur, IA appliquée, conception de dispositifs, orchestration technique ; jamais ingénieur logiciel.
- Ne jamais inventer client, utilisateur, mission, résultat, métrique, adoption, déploiement institutionnel ou formation délivrée.
- Ne jamais publier la formulation interdite concernant le suivi individualisé des élèves en difficulté d’accrochage.
- Aucun compte, backend, API IA, collecte ou donnée élève dans PiloteCours.
- Ne modifier ni `cv-enseignant` ni `cv-formateur`.
- Ne publier aucun numéro de téléphone.
- Ne pas envoyer le brouillon Pierre Lelong.
- Branche de travail : `portfolio-conversion-v2` ; PR vers `main` ; fusion seulement après tests verts.

---

### Task 1: Contrats publics et structure attendue

**Files:**
- Modify: `scripts/validate-site.mjs`
- Test: `scripts/validate-site.mjs`

**Interfaces:**
- Consumes: dossier `site/`.
- Produces: validation exécutable des routes, métadonnées et CTA requis.

- [ ] **Step 1: Ajouter les contrats avant les pages**

Étendre `expected` avec :

```js
'demos/pilotecours/index.html',
'demos/pilotecours/app.js',
'demos/pilotecours/pilotecours.js',
'demos/pilotecours/styles.css',
'demos/pilotecours/manifest.webmanifest',
'demos/pilotecours/icon.svg'
```

Vérifier aussi que la homepage contient les sections `frictions`, `preuves`, `methode`, `contributions`, `garde-fous`, `a-propos` et `contact`, les deux CTA canoniques, la route PiloteCours et le lien TeacherFlow.

- [ ] **Step 2: Vérifier l’échec RED**

Run: `node scripts/validate-site.mjs`

Expected: échec sur `demos/pilotecours/index.html` absent.

- [ ] **Step 3: Conserver le validateur rouge jusqu’aux tâches 2 à 4**

Ne pas affaiblir les assertions pour obtenir un succès prématuré.

---

### Task 2: Modèle métier PiloteCours

**Files:**
- Create: `site/demos/pilotecours/pilotecours.js`
- Create: `tests/pilotecours.test.mjs`

**Interfaces:**
- Consumes: aucun navigateur.
- Produces: `PHASES`, `RECADRAGES`, `createInitialState()`, `normalizeState()`, `navigateToPhase()`, `nextPhaseId()`, `previousPhaseId()`, `toggleFavorite()` et `cycleTextScale()`.

- [ ] **Step 1: Écrire les tests comportementaux**

Cas littéraux :

```js
test('parcourt les cinq phases sans dépasser les bornes', () => {
  assert.equal(nextPhaseId('avant'), '0-15');
  assert.equal(nextPhaseId('fin'), null);
  assert.equal(previousPhaseId('avant'), null);
  assert.equal(previousPhaseId('15-45'), '0-15');
});

test('restaure un état sûr depuis un stockage malformé', () => {
  assert.deepEqual(normalizeState('{pas du json'), createInitialState());
});

test('mémorise la phase visitée pour proposer Reprendre', () => {
  const state = navigateToPhase(createInitialState(), '15-45');
  assert.equal(state.lastPhaseId, '15-45');
  assert.equal(state.currentView, 'phase');
});
```

Ajouter des cas pour les phases inconnues, les favoris sans doublon et le cycle `normal → large → xlarge → normal`.

- [ ] **Step 2: Vérifier l’échec RED**

Run: `node --test tests/pilotecours.test.mjs`

Expected: échec d’import parce que `pilotecours.js` n’existe pas.

- [ ] **Step 3: Implémenter le modèle minimal**

Créer les cinq phases dans l’ordre canonique et normaliser uniquement les clés publiques du schéma d’état.

- [ ] **Step 4: Vérifier GREEN**

Run: `node --test tests/pilotecours.test.mjs`

Expected: tous les tests réussissent sans avertissement.

---

### Task 3: Interface fonctionnelle PiloteCours

**Files:**
- Create: `site/demos/pilotecours/index.html`
- Create: `site/demos/pilotecours/app.js`
- Create: `site/demos/pilotecours/styles.css`
- Create: `site/demos/pilotecours/manifest.webmanifest`
- Create: `site/demos/pilotecours/icon.svg`

**Interfaces:**
- Consumes: exports de `pilotecours.js`, clé `localStorage` `pilotecours-web-v1`.
- Produces: parcours accueil, reprise, cinq phases, recadrages, favoris, taille de texte et mode discret.

- [ ] **Step 1: Créer la coque sémantique**

Inclure un skip link, un `<main id="app">`, un message `noscript`, le manifest, l’icône et `app.js` en module.

- [ ] **Step 2: Rendre l’état et brancher les actions**

`app.js` doit :

```js
const STORAGE_KEY = 'pilotecours-web-v1';
let state = normalizeState(localStorage.getItem(STORAGE_KEY));
const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
```

Toutes les transitions mettent à jour l’état, persistent puis rendent l’écran. Aucun bouton affiché ne doit être inerte.

- [ ] **Step 3: Construire le mode discret et les recadrages**

Le mode discret montre uniquement la phase, le repère utile, `Suivant`, `Retour au mode normal` et `Accueil`. Les recadrages restent professionnels, courts et non humiliants.

- [ ] **Step 4: Construire le CSS mobile-first**

Garantir des cibles tactiles de 44 px minimum, une largeur sans débordement à 360 px, un focus visible et une règle `prefers-reduced-motion`.

- [ ] **Step 5: Relancer les tests métier**

Run: `node --test tests/pilotecours.test.mjs`

Expected: succès.

---

### Task 4: Homepage, études de cas, SEO et README

**Files:**
- Modify: `site/index.html`
- Modify: `site/styles.css`
- Modify: `site/cases/teacherflow.html`
- Modify: `site/cases/pilotecours.html`
- Modify: `site/cases/second-cerveau.html`
- Modify: `site/sitemap.xml`
- Modify: `README.md`

**Interfaces:**
- Consumes: URL `/demos/pilotecours/`, URL TeacherFlow et coordonnées canoniques.
- Produces: parcours décideur complet et récit GitHub cohérent.

- [ ] **Step 1: Réécrire le hero et l’architecture homepage**

Utiliser la proposition :

```text
Je transforme des frictions pédagogiques concrètes en dispositifs simples, testables et responsables.
```

Ajouter les sections prévues dans la spécification et conserver exactement deux liens email visibles et canoniques : `Échanger` dans le hero et `Email` dans le CTA final.

- [ ] **Step 2: Hiérarchiser les trois preuves**

TeacherFlow, PiloteCours et Second cerveau doivent être les seules cartes principales. Chaque carte expose problème, réponse, capacité et action.

- [ ] **Step 3: Recentrer les trois études de cas**

PiloteCours reçoit le bouton `Ouvrir la démo web` et ses limites exactes. TeacherFlow réduit le discours technique. Second cerveau renforce `SOURCE → INFÉRENCE → PROPOSITION`.

- [ ] **Step 4: Mettre à jour SEO, sitemap et README**

Le README commence par positionnement, portfolio et trois preuves. Les projets secondaires deviennent une section discrète `Autres expérimentations`.

- [ ] **Step 5: Vérifier GREEN du validateur**

Run: `node scripts/validate-site.mjs`

Expected: toutes les pages et ressources sont validées.

---

### Task 5: QA locale et commit d’implémentation

**Files:**
- Verify: `site/**/*`
- Verify: `tests/pilotecours.test.mjs`

**Interfaces:**
- Consumes: build statique complet.
- Produces: preuves mobile, desktop, clavier, console, liens et persistance.

- [ ] **Step 1: Exécuter la suite complète**

Run:

```powershell
node --test tests/pilotecours.test.mjs
node scripts/validate-site.mjs
git diff --check
```

- [ ] **Step 2: Servir le dossier `site`**

Run: `python -m http.server 8765 --directory site`

- [ ] **Step 3: Vérifier les viewports**

Contrôler 360 × 800, 390 × 844, 412 × 915 et 1440 × 900 : aucun débordement, CTA visibles, commandes PiloteCours accessibles.

- [ ] **Step 4: Vérifier le parcours PiloteCours**

Commencer → cinq phases → précédent/suivant → recadrages → favori → mode discret → reload → reprendre. Contrôler `localStorage`, focus clavier et console.

- [ ] **Step 5: Vérifier tous les liens**

Contrôler les liens internes et les statuts HTTP de TeacherFlow, LinkedIn, GitHub et des trois études de cas sans ouvrir `mailto` dans un client.

- [ ] **Step 6: Commit ciblé**

Stage uniquement les fichiers du site, les tests, le validateur, le README, la spécification et le plan. Message : `Turn the portfolio into a conversation opener`.

---

### Task 6: PR, fusion et déploiement public

**Files:** aucun nouveau fichier.

**Interfaces:**
- Consumes: branche testée `portfolio-conversion-v2`.
- Produces: PR fusionnée, `main` publié et URL publique vérifiée.

- [ ] **Step 1: Pousser la branche**

Run: `git push -u origin portfolio-conversion-v2`.

- [ ] **Step 2: Créer une PR vers `main`**

Titre : `Transformer le portfolio en porte d’entrée décideur`.

Le corps documente récit, PiloteCours web, garde-fous et tests.

- [ ] **Step 3: Vérifier les contrôles de la PR puis fusionner**

Fusion autorisée uniquement si la suite locale et les contrôles GitHub sont verts.

- [ ] **Step 4: Attendre GitHub Pages et contrôler le public**

Vérifier l’accueil, `/demos/pilotecours/`, les trois études de cas et TeacherFlow en HTTP 200, puis refaire le parcours PiloteCours sur la version publique.

---

### Task 7: Brouillon Pierre Lelong

**Files:** aucun.

**Interfaces:**
- Consumes: sources officielles actuelles Technofutur TIC et portfolio public vert.
- Produces: brouillon Gmail revu, non envoyé, documenté `READY TO SEND`.

- [ ] **Step 1: Vérifier les faits actuels**

Utiliser uniquement les pages officielles Technofutur TIC pour le rôle de Pierre Lelong, l’organisation et la voie formateurs/collaboration.

- [ ] **Step 2: Lire le brouillon existant**

Identifier le brouillon Pierre par destinataire, objet et contenu ; ne modifier aucun autre brouillon.

- [ ] **Step 3: Réécrire en 150 à 180 mots maximum hors signature**

Structure : pourquoi Technofutur, identité, preuve unique vers le portfolio, deux contributions proposées, demande d’échange bref.

- [ ] **Step 4: Enregistrer sans envoyer**

Conserver le destinataire vérifié et laisser le brouillon dans Gmail. Le statut `READY TO SEND` est documentaire ; aucun envoi.

---

### Task 8: Notion et rapport final

**Files:**
- Modify: `JOURNAL-EXECUTION-CODEX.md`

**Interfaces:**
- Consumes: preuves finales GitHub, URLs publiques, QA et brouillon Gmail.
- Produces: passation fidèle dans Notion et verdict GREEN/RED.

- [ ] **Step 1: Mettre à jour `13 — Portfolio public & démonstrateurs`**

Documenter AVANT, DÉCISION, MODIFICATIONS, PREUVES et TESTS.

- [ ] **Step 2: Mettre à jour Mission 04**

Documenter l’objet final Pierre et `READY TO SEND — non envoyé`.

- [ ] **Step 3: Ajouter une entrée au Journal Codex**

Inclure branche, PR, merge commit, workflow, URLs, tests, limites et prochaine action unique.

- [ ] **Step 4: Rendre le verdict**

`GREEN — PRÊT À ENVOYER` uniquement si portfolio public, PiloteCours public, TeacherFlow, liens, mobile, desktop, GitHub Pages et brouillon sont tous vérifiés. Sinon `RED — NE PAS ENVOYER` avec la cause exacte.
