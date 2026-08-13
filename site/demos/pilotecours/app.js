import {
  PHASES,
  RECADRAGES,
  STORAGE_KEY,
  cycleTextScale,
  getPhase,
  navigateToPhase,
  nextPhaseId,
  normalizeState,
  previousPhaseId,
  toggleFavorite
} from './pilotecours.js';

const app = document.querySelector('#app');
const main = document.querySelector('#app-main');
const scaleButton = document.querySelector('[data-action="text-scale"]');
const overlay = document.querySelector('[data-overlay]');
const overlayPhrase = document.querySelector('[data-overlay-phrase]');

let state = loadState();

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return normalizeState(null);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // L’interface reste pleinement utilisable si le stockage local est indisponible.
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function updateState(nextState, { focusMain = true } = {}) {
  state = normalizeState(nextState);
  saveState();
  render();
  if (focusMain) requestAnimationFrame(() => main.focus());
}

function phaseButton(phase, index) {
  const isLast = state.lastPhaseId === phase.id;
  return `
    <button class="phase-row" type="button" data-action="phase" data-phase-id="${phase.id}">
      <span class="phase-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="phase-copy">
        <strong>${escapeHtml(phase.title)}</strong>
        <small>${escapeHtml(phase.eyebrow)}</small>
      </span>
      ${isLast ? '<span class="resume-tag">Reprise</span>' : '<span class="row-arrow" aria-hidden="true">→</span>'}
    </button>`;
}

function renderHome() {
  const resumePhase = getPhase(state.lastPhaseId);
  return `
    <section class="screen home-screen" aria-labelledby="home-title">
      <div class="hero-panel">
        <p class="eyebrow">Démonstrateur · sans compte</p>
        <h1 id="home-title">Le bon repère,<br /><span>au bon moment.</span></h1>
        <p class="hero-copy">Une aide de terrain pour garder le fil de la séance sans ajouter une usine à gaz dans la poche.</p>
        <div class="primary-actions">
          <button class="button button-primary" type="button" data-action="start">Commencer</button>
          ${
            resumePhase
              ? `<button class="button button-secondary" type="button" data-action="resume">Reprendre · ${escapeHtml(resumePhase.title)}</button>`
              : ''
          }
        </div>
      </div>

      <section class="quick-grid" aria-labelledby="quick-title">
        <div class="section-heading">
          <p class="eyebrow">Accès immédiat</p>
          <h2 id="quick-title">Quand la seconde compte</h2>
        </div>
        <button class="quick-card accent" type="button" data-action="view-reframes">
          <span class="quick-icon" aria-hidden="true">!</span>
          <span><strong>Recadrage rapide</strong><small>8 formulations courtes</small></span>
          <span aria-hidden="true">→</span>
        </button>
        <button class="quick-card" type="button" data-action="view-discreet">
          <span class="quick-icon quiet" aria-hidden="true">◐</span>
          <span><strong>Mode discret</strong><small>L’essentiel, sans distraction</small></span>
          <span aria-hidden="true">→</span>
        </button>
      </section>

      <section class="phase-list" aria-labelledby="phases-title">
        <div class="section-heading section-heading-inline">
          <div>
            <p class="eyebrow">Parcours</p>
            <h2 id="phases-title">Les cinq temps</h2>
          </div>
          <span>5 repères</span>
        </div>
        <div class="phase-rows">${PHASES.map(phaseButton).join('')}</div>
      </section>

      <aside class="privacy-note">
        <span aria-hidden="true">✓</span>
        <p><strong>Pas de saisie élève.</strong> La reprise, la taille du texte et les favoris restent uniquement dans ce navigateur.</p>
      </aside>
    </section>`;
}

function renderPhase() {
  const phase = getPhase(state.currentPhaseId) ?? PHASES[0];
  const index = PHASES.findIndex(({ id }) => id === phase.id);
  const previous = previousPhaseId(phase.id);
  const next = nextPhaseId(phase.id);

  const sections = phase.sections
    .map(
      (section) => `
        <section class="cue-card tone-${section.tone}" aria-labelledby="${phase.id}-${section.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}">
          <h2 id="${phase.id}-${section.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}">${escapeHtml(section.label)}</h2>
          <ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        </section>`
    )
    .join('');

  return `
    <section class="screen phase-screen" aria-labelledby="phase-title">
      <div class="screen-topline">
        <button class="text-button" type="button" data-action="view-home">← Accueil</button>
        <span>Étape ${index + 1} / ${PHASES.length}</span>
      </div>
      <header class="phase-heading">
        <p class="eyebrow">${escapeHtml(phase.eyebrow)}</p>
        <h1 id="phase-title">${escapeHtml(phase.title)}</h1>
        <div class="progress" aria-label="Étape ${index + 1} sur ${PHASES.length}">
          <span style="width: ${((index + 1) / PHASES.length) * 100}%"></span>
        </div>
      </header>

      <div class="cue-list">${sections}</div>

      <button class="button emergency-button" type="button" data-action="view-reframes">Recadrage rapide</button>

      <nav class="phase-navigation" aria-label="Navigation entre les phases">
        ${
          previous
            ? `<button class="button button-secondary" type="button" data-action="phase" data-phase-id="${previous}">← Précédent</button>`
            : `<button class="button button-secondary" type="button" data-action="view-home">← Accueil</button>`
        }
        ${
          next
            ? `<button class="button button-primary" type="button" data-action="phase" data-phase-id="${next}">Suivant →</button>`
            : `<button class="button button-primary" type="button" data-action="view-home">Terminer</button>`
        }
      </nav>
    </section>`;
}

function reframeRow(phrase) {
  const favorite = state.favoriteReframes.includes(phrase);
  const safePhrase = escapeHtml(phrase);
  return `
    <div class="reframe-row">
      <button class="reframe-phrase" type="button" data-action="show-reframe" data-phrase="${safePhrase}">${safePhrase}</button>
      <button
        class="favorite-button"
        type="button"
        data-action="toggle-favorite"
        data-phrase="${safePhrase}"
        aria-label="${favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} : ${safePhrase}"
        aria-pressed="${favorite}"
      >${favorite ? '★' : '☆'}</button>
    </div>`;
}

function renderReframes() {
  const favoriteBlock = state.favoriteReframes.length
    ? `
      <section class="reframe-group" aria-labelledby="favorites-title">
        <p class="eyebrow" id="favorites-title">Favoris locaux</p>
        ${state.favoriteReframes.map(reframeRow).join('')}
      </section>`
    : '';

  return `
    <section class="screen reframe-screen" aria-labelledby="reframes-title">
      <div class="screen-topline">
        <button class="text-button" type="button" data-action="view-home">← Accueil</button>
        <span>Appuyer pour agrandir</span>
      </div>
      <header class="phase-heading compact-heading">
        <p class="eyebrow">Accès immédiat</p>
        <h1 id="reframes-title">Recadrages</h1>
        <p>Courts, calmes, sans négociation improvisée avec le chaos.</p>
      </header>
      ${favoriteBlock}
      <section class="reframe-group" aria-labelledby="all-reframes-title">
        <p class="eyebrow" id="all-reframes-title">Toutes les formulations</p>
        ${RECADRAGES.map(reframeRow).join('')}
      </section>
    </section>`;
}

function renderDiscreet() {
  return `
    <section class="screen discreet-screen" aria-labelledby="discreet-title">
      <div class="screen-topline">
        <button class="text-button" type="button" data-action="view-home">← Quitter</button>
        <span>Mode discret</span>
      </div>
      <h1 id="discreet-title" class="visually-hidden">Repères essentiels</h1>
      <div class="discreet-words" aria-label="Posture">
        <strong>Calme</strong>
        <strong>Lent</strong>
        <strong>Regard large</strong>
      </div>
      <div class="discreet-divider" aria-hidden="true"></div>
      <div class="discreet-actions" aria-label="Recadrages essentiels">
        ${['On écoute.', 'On reprend.', 'À la fin.']
          .map(
            (phrase) =>
              `<button type="button" data-action="show-reframe" data-phrase="${escapeHtml(phrase)}">${escapeHtml(phrase)}</button>`
          )
          .join('')}
      </div>
    </section>`;
}

function render() {
  document.body.dataset.textScale = state.textScale;
  document.body.dataset.discreet = state.currentView === 'discreet' ? 'true' : 'false';
  scaleButton.setAttribute(
    'aria-label',
    state.textScale === 'normal' ? 'Agrandir le texte' : state.textScale === 'large' ? 'Agrandir encore le texte' : 'Réduire le texte'
  );

  const views = {
    home: renderHome,
    phase: renderPhase,
    recadrages: renderReframes,
    discreet: renderDiscreet
  };
  app.innerHTML = (views[state.currentView] ?? renderHome)();
}

function closeOverlay() {
  overlay.hidden = true;
  document.body.classList.remove('overlay-open');
}

document.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;

  const action = control.dataset.action;
  if (action === 'text-scale') {
    updateState({ ...state, textScale: cycleTextScale(state.textScale) }, { focusMain: false });
  } else if (action === 'start') {
    updateState(navigateToPhase(state, PHASES[0].id));
  } else if (action === 'resume' && state.lastPhaseId) {
    updateState(navigateToPhase(state, state.lastPhaseId));
  } else if (action === 'phase') {
    updateState(navigateToPhase(state, control.dataset.phaseId));
  } else if (action === 'view-home') {
    updateState({ ...state, currentView: 'home', discreet: false });
  } else if (action === 'view-reframes') {
    updateState({ ...state, currentView: 'recadrages', discreet: false });
  } else if (action === 'view-discreet') {
    updateState({ ...state, currentView: 'discreet', discreet: true });
  } else if (action === 'toggle-favorite') {
    updateState(toggleFavorite(state, control.dataset.phrase), { focusMain: false });
  } else if (action === 'show-reframe') {
    overlayPhrase.textContent = control.dataset.phrase;
    overlay.hidden = false;
    document.body.classList.add('overlay-open');
    overlay.querySelector('[data-action="close-reframe"]').focus();
  } else if (action === 'close-reframe') {
    closeOverlay();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !overlay.hidden) closeOverlay();
});

render();
