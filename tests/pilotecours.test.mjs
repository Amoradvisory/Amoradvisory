import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PHASES,
  RECADRAGES,
  createInitialState,
  normalizeState,
  navigateToPhase,
  nextPhaseId,
  previousPhaseId,
  toggleFavorite,
  cycleTextScale
} from '../site/demos/pilotecours/pilotecours.js';

test('les cinq phases canoniques restent ordonnées et exploitables', () => {
  assert.deepEqual(
    PHASES.map(({ id, title }) => ({ id, title })),
    [
      { id: 'avant-entree', title: "Avant d’entrer" },
      { id: '0-15', title: '0–15 min' },
      { id: '15-45', title: '15–45 min' },
      { id: '45-120', title: '45–120 min' },
      { id: 'fin', title: 'Fin de séance' }
    ]
  );

  for (const phase of PHASES) {
    assert.ok(phase.sections.length > 0, `${phase.id} doit contenir au moins une section`);
    assert.ok(
      phase.sections.every((section) => section.label && section.items.length > 0),
      `${phase.id} doit rester directement utilisable en classe`
    );
  }
});

test('l’état initial ne contient aucune donnée personnelle ni reprise fictive', () => {
  assert.deepEqual(createInitialState(), {
    currentView: 'home',
    currentPhaseId: 'avant-entree',
    lastPhaseId: null,
    textScale: 'normal',
    favoriteReframes: [],
    discreet: false
  });
});

test('normalizeState répare un stockage local incomplet ou corrompu', () => {
  const normalized = normalizeState({
    currentView: 'ailleurs',
    currentPhaseId: 'inconnue',
    lastPhaseId: '15-45',
    textScale: 'géant',
    favoriteReframes: [RECADRAGES[0], 'phrase inventée', RECADRAGES[0]],
    discreet: 'oui'
  });

  assert.deepEqual(normalized, {
    currentView: 'home',
    currentPhaseId: 'avant-entree',
    lastPhaseId: '15-45',
    textScale: 'normal',
    favoriteReframes: [RECADRAGES[0]],
    discreet: false
  });
  assert.deepEqual(normalizeState(null), createInitialState());
});

test('la navigation enregistre la dernière phase sans muter l’état reçu', () => {
  const initial = createInitialState();
  const next = navigateToPhase(initial, '15-45');

  assert.deepEqual(initial, createInitialState());
  assert.deepEqual(next, {
    ...initial,
    currentView: 'phase',
    currentPhaseId: '15-45',
    lastPhaseId: '15-45'
  });
  assert.deepEqual(navigateToPhase(next, 'inconnue'), next);
});

test('précédent et suivant respectent les bornes du parcours', () => {
  assert.equal(previousPhaseId('avant-entree'), null);
  assert.equal(nextPhaseId('avant-entree'), '0-15');
  assert.equal(previousPhaseId('45-120'), '15-45');
  assert.equal(nextPhaseId('45-120'), 'fin');
  assert.equal(nextPhaseId('fin'), null);
  assert.equal(nextPhaseId('inconnue'), null);
});

test('les recadrages favoris sont limités au répertoire canonique', () => {
  const initial = createInitialState();
  const added = toggleFavorite(initial, RECADRAGES[2]);
  const ignored = toggleFavorite(added, 'Ne figure pas dans la source');
  const removed = toggleFavorite(ignored, RECADRAGES[2]);

  assert.deepEqual(added.favoriteReframes, [RECADRAGES[2]]);
  assert.deepEqual(ignored, added);
  assert.deepEqual(removed.favoriteReframes, []);
  assert.deepEqual(initial.favoriteReframes, []);
});

test('la taille de texte suit un cycle court et prévisible', () => {
  assert.equal(cycleTextScale('normal'), 'large');
  assert.equal(cycleTextScale('large'), 'xlarge');
  assert.equal(cycleTextScale('xlarge'), 'normal');
  assert.equal(cycleTextScale('valeur-corrompue'), 'normal');
});
