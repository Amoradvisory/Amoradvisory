export const STORAGE_KEY = 'pilotecours-web-v1';

export const PHASES = Object.freeze([
  {
    id: 'avant-entree',
    title: 'Avant d’entrer',
    eyebrow: 'Se préparer',
    sections: [
      {
        label: 'Posture',
        tone: 'focus',
        items: ['Calme — Lent — Stable', 'Voix posée — Regard large', 'Peu de gestes']
      },
      {
        label: 'À éviter',
        tone: 'alert',
        items: ['Parler sur le bruit', 'Se justifier ou se vexer', 'Trop expliquer ou menacer']
      },
      {
        label: 'Rappels',
        tone: 'neutral',
        items: [
          'Ils testent le cadre, pas ma valeur.',
          'Je corrige tôt et brièvement.',
          'Je n’ai pas besoin d’impressionner.',
          'Je dois être clair.'
        ]
      }
    ]
  },
  {
    id: '0-15',
    title: '0–15 min',
    eyebrow: 'Installer le cadre',
    sections: [
      {
        label: 'Entrée',
        tone: 'neutral',
        items: ['Bonjour. Installez-vous. On commence.', 'Je commence quand j’ai tout le monde.']
      },
      {
        label: 'Présentation',
        tone: 'neutral',
        items: [
          'Je suis votre nouveau professeur pour les cours commerciaux.',
          'Aujourd’hui : faire connaissance, voir le fonctionnement, commencer à travailler.'
        ]
      },
      {
        label: 'Cadre',
        tone: 'focus',
        items: [
          'Respect, écoute, pas de moqueries, tout le monde essaie.',
          'Je ne vous demande pas d’être parfaits. Je vous demande de jouer le jeu.'
        ]
      },
      {
        label: 'Lancement',
        tone: 'neutral',
        items: [
          'Chacun dit son prénom et une chose qu’il sait bien faire.',
          'Pas forcément à l’école. Une phrase. On va vite.'
        ]
      },
      {
        label: 'Si « je ne sais rien faire »',
        tone: 'attention',
        items: ['Impossible. Donne une chose simple.', 'Aider, parler, bricoler, convaincre, écouter, organiser…']
      },
      {
        label: 'Transition',
        tone: 'positive',
        items: ['Très bien. Je vais vous expliquer comment le cours va fonctionner.']
      }
    ]
  },
  {
    id: '15-45',
    title: '15–45 min',
    eyebrow: 'Rendre le fonctionnement explicite',
    sections: [
      {
        label: 'Méthode',
        tone: 'focus',
        items: [
          'On ne va pas recopier. On travaille concrètement : parler, observer, faire des mises en situation.',
          'L’objectif : que ce soit utile. Magasin, stage, emploi, communication.'
        ]
      },
      {
        label: 'Évaluation',
        tone: 'positive',
        items: [
          'Évaluation surtout pratique.',
          'Participation, implication, communication, progression.',
          'Le but : vous faire progresser, pas vous piéger.'
        ]
      },
      {
        label: 'Vérification',
        tone: 'attention',
        items: ['Qui peut me redire une règle du cours ?', 'Qui peut me redire comment on sera évalués ?']
      },
      {
        label: 'Réflexion',
        tone: 'neutral',
        items: [
          'Chacun réfléchit :',
          '1. Une force que j’ai.',
          '2. Une chose à améliorer.',
          'Qui commence ? Une phrase courte.'
        ]
      }
    ]
  },
  {
    id: '45-120',
    title: '45–120 min',
    eyebrow: 'Faire travailler le groupe',
    sections: [
      {
        label: 'Introduction',
        tone: 'neutral',
        items: [
          'Avant de comprendre un client, il faut se comprendre soi-même.',
          'On va travailler : se présenter, écouter, argumenter, vendre.'
        ]
      },
      {
        label: 'Questions',
        tone: 'focus',
        items: [
          'Qu’est-ce qu’un bon vendeur ?',
          'Qu’est-ce qui donne envie d’écouter quelqu’un ?',
          'Qu’est-ce qui agace un client ?',
          'Qu’est-ce qu’un vendeur sérieux ?'
        ]
      },
      {
        label: 'En cas de silence',
        tone: 'attention',
        items: ['Juste un mot. Un exemple suffit.', 'Je commence, puis vous continuez.']
      },
      {
        label: 'En cas de bruit',
        tone: 'alert',
        items: ['On revient ensemble.', 'J’ai besoin de votre attention.']
      },
      {
        label: 'Si le cadre est testé',
        tone: 'attention',
        items: ['On en parle à la fin.', 'Tu reformules correctement.', 'Merci. On avance.']
      }
    ]
  },
  {
    id: 'fin',
    title: 'Fin de séance',
    eyebrow: 'Clore sans relâcher le cadre',
    sections: [
      {
        label: 'Conclusion',
        tone: 'positive',
        items: [
          'Je n’attends pas la perfection.',
          'Être présents, respectueux, capables d’essayer.',
          'Si vous jouez le jeu, on avancera bien.',
          'Merci.',
          'La prochaine fois, on travaille directement.'
        ]
      }
    ]
  }
]);

export const RECADRAGES = Object.freeze([
  'On écoute.',
  'On reprend.',
  'Un seul parle.',
  'On ne commente pas.',
  'On en parle à la fin.',
  'Merci. On avance.',
  'Reformule.',
  'Les autres écoutent.'
]);

const VIEWS = Object.freeze(['home', 'phase', 'recadrages', 'discreet']);
const TEXT_SCALES = Object.freeze(['normal', 'large', 'xlarge']);

export function createInitialState() {
  return {
    currentView: 'home',
    currentPhaseId: PHASES[0].id,
    lastPhaseId: null,
    textScale: 'normal',
    favoriteReframes: [],
    discreet: false
  };
}

export function getPhase(phaseId) {
  return PHASES.find(({ id }) => id === phaseId) ?? null;
}

export function normalizeState(input) {
  const initial = createInitialState();
  const source = input && typeof input === 'object' ? input : {};
  const favorites = Array.isArray(source.favoriteReframes)
    ? [...new Set(source.favoriteReframes.filter((phrase) => RECADRAGES.includes(phrase)))]
    : initial.favoriteReframes;

  return {
    currentView: VIEWS.includes(source.currentView) ? source.currentView : initial.currentView,
    currentPhaseId: getPhase(source.currentPhaseId)?.id ?? initial.currentPhaseId,
    lastPhaseId: getPhase(source.lastPhaseId)?.id ?? null,
    textScale: TEXT_SCALES.includes(source.textScale) ? source.textScale : initial.textScale,
    favoriteReframes: favorites,
    discreet: typeof source.discreet === 'boolean' ? source.discreet : initial.discreet
  };
}

export function navigateToPhase(state, phaseId) {
  const normalized = normalizeState(state);
  if (!getPhase(phaseId)) return normalized;

  return {
    ...normalized,
    currentView: 'phase',
    currentPhaseId: phaseId,
    lastPhaseId: phaseId,
    discreet: false
  };
}

export function nextPhaseId(phaseId) {
  const index = PHASES.findIndex(({ id }) => id === phaseId);
  return index >= 0 && index < PHASES.length - 1 ? PHASES[index + 1].id : null;
}

export function previousPhaseId(phaseId) {
  const index = PHASES.findIndex(({ id }) => id === phaseId);
  return index > 0 ? PHASES[index - 1].id : null;
}

export function toggleFavorite(state, phrase) {
  const normalized = normalizeState(state);
  if (!RECADRAGES.includes(phrase)) return normalized;

  const isFavorite = normalized.favoriteReframes.includes(phrase);
  return {
    ...normalized,
    favoriteReframes: isFavorite
      ? normalized.favoriteReframes.filter((favorite) => favorite !== phrase)
      : [...normalized.favoriteReframes, phrase]
  };
}

export function cycleTextScale(textScale) {
  const index = TEXT_SCALES.indexOf(textScale);
  if (index === -1) return 'normal';
  return TEXT_SCALES[(index + 1) % TEXT_SCALES.length];
}
