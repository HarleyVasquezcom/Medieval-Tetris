/* ============================================================
   Locale: Français (fr) — même jeu de clés que en.js.
   Chaque locale DOIT définir exactement les mêmes clés.
   ============================================================ */
(function (g) {
  'use strict';
  g.MT_Locales = g.MT_Locales || {};

  g.MT_Locales.fr = {
    __name: 'Français',
    __dir: 'ltr',

    brand: 'Medieval Tetris',
    tagline: '1000 niveaux du très facile au très difficile',

    /* menu */
    play: 'Jouer',
    continue: 'Continuer',
    levelSelect: 'Sélection du niveau',
    howToPlay: 'Comment jouer',
    settings: 'Paramètres',
    back: 'Retour',
    retry: 'Rejouer le niveau',
    nextLevel: 'Niveau suivant',
    mainMenu: 'Menu principal',
    resume: 'Reprendre',
    quitToMenu: 'Quitter vers le menu',

    /* HUD */
    hold: 'Réserve',
    next: 'Suivant',
    level: 'Niveau',
    goal: 'Objectif',
    linesCleared: 'Lignes',
    score: 'Score',
    best: 'Record',
    combo: 'Combo',
    levelScore: 'Score du niveau',
    difficulty: 'Difficulté',
    veryEasy: 'Très facile',
    veryHard: 'Très difficile',
    controls: 'Commandes',

    ctlMove: 'Déplacement',
    ctlSoft: 'Chute douce',
    ctlRotate: 'Rotation',
    ctlRotateCCW: 'Rotation à gauche',
    ctlDrop: 'Chute rapide',
    ctlHold: 'Mettre en réserve',
    ctlPause: 'Pause',
    ctlMute: 'Couper le son',

    /* top bar titles */
    language: 'Langue',
    sound: 'Son',
    pause: 'Pause',

    /* settings */
    unlockAll: 'Débloquer tous les niveaux (jeu libre)',
    ghost: 'Pièce fantôme',
    resetProgress: 'Effacer la progression',

    /* dynamic strings ({vars} are replaced at runtime) */
    progressFoot: '{done} niveaux sur 1000 débloqués',
    menuProgress: 'Votre quête en est au niveau {n} · Meilleur score {score}',
    worldLabel: 'Monde {n}',
    speedLine: '{ms} ms par ligne · {das} ms de réponse',
    goalLabel: 'Effacer {n} lignes',
    scoreLabel: 'Score : {score}',
    levelClearText: '{lines} lignes effacées · {points} points',
    gameOverText: 'Votre château est tombé au niveau {n}.',
    victoryText: 'Vous avez conquis les 1000 niveaux !',
    pausedText: 'Le royaume vous attend.',
    bestLabel: 'Record sur ce niveau : {score}',
    confirmReset: 'Effacer vos niveaux débloqués, vos scores et vos paramètres ?',
    lockedToast: 'Terminez d\'abord le niveau {n} pour débloquer celui-ci',
    pageOf: 'Page {a} sur {b}',
    linesShort: '{n} lignes',

    /* banners */
    levelClearTitle: 'Niveau réussi !',
    gameOverTitle: 'Partie terminée',
    pausedTitle: 'En pause',
    victoryTitle: 'Vive le champion !',

    /* line-clear callouts */
    clear1: 'Simple',
    clear2: 'Double',
    clear3: 'Triple',
    clear4: 'TETRIS',
    clearTspin: 'T-Spin',
    clearTspin2: 'T-Spin Double',
    comboCall: '{n}× Combo',
    b2bCall: 'Back-to-back !',

    /* level modifiers */
    mod_fairbag: 'Sac équitable',
    mod_garbage_start: 'Lignes pré-remplies',
    mod_garbage_storm: 'Tempête de déchets',
    mod_blind_next: 'Aperçu unique',
    mod_no_ghost: 'Sans fantôme',

    /* how to play (HTML) */
    howto:
      '<h3>Objectif</h3>' +
      '<p>Les térominos tombés doivent être empilés à l\'intérieur de la muraille du château. Complétez une rangée de pierre complète et elle est <strong>détruite</strong>. Effacez le nombre de lignes exigé par le niveau pour ouvrir la porte du niveau suivant.</p>' +
      '<h3>Commandes</h3>' +
      '<ul>' +
      '<li><kbd>←</kbd> <kbd>→</kbd> ou <kbd>A</kbd> <kbd>D</kbd> — déplacer la pièce</li>' +
      '<li><kbd>↓</kbd> ou <kbd>S</kbd> — chute douce</li>' +
      '<li><kbd>↑</kbd>/<kbd>X</kbd> — rotation horaire, <kbd>Z</kbd>/<kbd>Ctrl</kbd> — rotation antihoraire</li>' +
      '<li><kbd>Espace</kbd> — chute rapide, <kbd>C</kbd>/<kbd>Shift</kbd> — mettre une pièce en réserve</li>' +
      '<li><kbd>P</kbd> ou <kbd>Esc</kbd> — pause, <kbd>M</kbd> — couper le son</li>' +
      '<li>Sur les appareils tactiles, utilisez le pavé à l\'écran ou glissez le doigt sur le plateau.</li>' +
      '</ul>' +
      '<h3>Score</h3>' +
      '<ul>' +
      '<li>Simple 100 · Double 300 · Triple 500 · <strong>Tetris 800</strong></li>' +
      '<li>Les bonus T-Spin et back-to-back multiplient vos points</li>' +
      '<li>Les combos s\'empilent : chaque ligne supplémentaire d\'une chaîne en ajoute davantage</li>' +
      '<li>Chute douce +1 par case, chute rapide +2 par case</li>' +
      '<li>Chaque niveau multiplie votre score de 1,00× à 3,00×</li>' +
      '</ul>' +
      '<h3>Les 1000 niveaux</h3>' +
      '<ul>' +
      '<li><strong>100 mondes × 10 niveaux</strong>, regroupés en 10 rangs, du Page à la Légende.</li>' +
      '<li>Le niveau 1 tombe à 1000 ms par ligne ; le niveau 1000 à <strong>48 ms</strong>.</li>' +
      '<li>Les premiers mondes vous offrent 5 aperçus, un sac équitable et une pièce fantôme.</li>' +
      '<li>À mi-parcours apparaissent des lignes pré-remplies et un temps de verrouillage plus court.</li>' +
      '<li>Les 100 derniers niveaux n\'affichent qu\'un aperçu, aucun fantôme et une <strong>tempête de déchets</strong> qui ne cesse jamais d\'injecter des lignes.</li>' +
      '</ul>' +
      '<h3>Langues</h3>' +
      '<p>English, Español, Français, Deutsch, Italiano et Português — changez à tout moment depuis la barre supérieure.</p>',

    /* world naming (10 realms × 10 qualifiers = 100 worlds) */
    worldLink: 'de',
    worldNoun: ['Royaume', 'Château', 'Donjon', 'Forteresse', 'Vallée', 'Forêt', 'Citadelle', 'Cachot', 'Tour', 'Comté'],
    worldQual: ['Feu', 'Glace', 'Fer', 'Ombre', 'Givre', 'Épée', 'Lune', 'Tempête', 'Dragon', 'Sang'],

    /* 10 ranks, 100 levels each */
    tiers: ['Page', 'Écuyer', 'Chevalier', 'Baron', 'Vicomte', 'Comte', 'Duc', 'Roi', 'Empereur', 'Légende']
  };
})(typeof window !== 'undefined' ? window : globalThis);
