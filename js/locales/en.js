/* ============================================================
   Locale: English (en) — reference key set.
   Every other locale MUST define exactly the same keys.
   ============================================================ */
(function (g) {
  'use strict';
  g.MT_Locales = g.MT_Locales || {};

  g.MT_Locales.en = {
    __name: 'English',
    __dir: 'ltr',

    brand: 'Medieval Tetris',
    tagline: '1000 levels from very easy to very hard',

    /* menu */
    play: 'Play',
    continue: 'Continue',
    levelSelect: 'Level select',
    howToPlay: 'How to play',
    settings: 'Settings',
    back: 'Back',
    retry: 'Retry level',
    nextLevel: 'Next level',
    mainMenu: 'Main menu',
    resume: 'Resume',
    quitToMenu: 'Quit to menu',

    /* HUD */
    hold: 'Hold',
    next: 'Next',
    level: 'Level',
    goal: 'Goal',
    linesCleared: 'Lines',
    score: 'Score',
    best: 'Best',
    combo: 'Combo',
    levelScore: 'Level score',
    difficulty: 'Difficulty',
    veryEasy: 'Very easy',
    veryHard: 'Very hard',
    controls: 'Controls',

    ctlMove: 'Move',
    ctlSoft: 'Soft drop',
    ctlRotate: 'Rotate',
    ctlRotateCCW: 'Rotate left',
    ctlDrop: 'Hard drop',
    ctlHold: 'Hold',
    ctlPause: 'Pause',
    ctlMute: 'Mute',

    /* top bar titles */
    language: 'Language',
    sound: 'Sound',
    pause: 'Pause',

    /* settings */
    unlockAll: 'Unlock every level (free play)',
    ghost: 'Landing ghost piece',
    resetProgress: 'Erase progress',

    /* dynamic strings ({vars} are replaced at runtime) */
    progressFoot: '{done} of 1000 levels unlocked',
    menuProgress: 'Your quest reaches level {n} · Best score {score}',
    worldLabel: 'World {n}',
    speedLine: '{ms} ms per row · {das} ms response',
    goalLabel: 'Clear {n} lines',
    scoreLabel: 'Score: {score}',
    levelClearText: '{lines} lines cleared · {points} points',
    gameOverText: 'Your castle has fallen on level {n}.',
    victoryText: 'You conquered all 1000 levels!',
    pausedText: 'The kingdom waits for you.',
    bestLabel: 'Best on this level: {score}',
    confirmReset: 'Erase your unlocked levels, scores and settings?',
    lockedToast: 'Finish level {n} first to unlock this one',
    pageOf: 'Page {a} of {b}',
    linesShort: '{n} lines',

    /* banners */
    levelClearTitle: 'Level cleared!',
    gameOverTitle: 'Game over',
    pausedTitle: 'Paused',
    victoryTitle: 'Long live the champion!',

    /* line-clear callouts */
    clear1: 'Single',
    clear2: 'Double',
    clear3: 'Triple',
    clear4: 'TETRIS',
    clearTspin: 'T-Spin',
    clearTspin2: 'T-Spin Double',
    comboCall: '{n}× Combo',
    b2bCall: 'Back-to-back!',

    /* level modifiers */
    mod_fairbag: 'Fair bag',
    mod_garbage_start: 'Pre-filled rows',
    mod_garbage_storm: 'Garbage storm',
    mod_blind_next: 'One preview',
    mod_no_ghost: 'No ghost',

    /* how to play (HTML) */
    howto:
      '<h3>Objective</h3>' +
      '<p>Fallen tetrominoes must be stacked inside the castle wall. Complete a full row of stone and it is <strong>destroyed</strong>. Clear the number of lines required by the level to open the gate to the next one.</p>' +
      '<h3>Controls</h3>' +
      '<ul>' +
      '<li><kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd> — move the piece</li>' +
      '<li><kbd>↓</kbd> or <kbd>S</kbd> — soft drop</li>' +
      '<li><kbd>↑</kbd>/<kbd>X</kbd> — rotate clockwise, <kbd>Z</kbd>/<kbd>Ctrl</kbd> — counter-clockwise</li>' +
      '<li><kbd>Space</kbd> — hard drop, <kbd>C</kbd>/<kbd>Shift</kbd> — hold a piece</li>' +
      '<li><kbd>P</kbd> or <kbd>Esc</kbd> — pause, <kbd>M</kbd> — mute</li>' +
      '<li>On touch devices use the on-screen pad or swipe on the board.</li>' +
      '</ul>' +
      '<h3>Scoring</h3>' +
      '<ul>' +
      '<li>Single 100 · Double 300 · Triple 500 · <strong>Tetris 800</strong></li>' +
      '<li>T-spin and back-to-back bonuses multiply your points</li>' +
      '<li>Combos stack: every extra row in a chain adds more</li>' +
      '<li>Soft drop +1 per cell, hard drop +2 per cell</li>' +
      '<li>Each level multiplies your score from 1.00× to 3.00×</li>' +
      '</ul>' +
      '<h3>The 1000 levels</h3>' +
      '<ul>' +
      '<li><strong>100 worlds × 10 levels</strong>, grouped into 10 ranks from Page to Legend.</li>' +
      '<li>Level 1 falls at 1000 ms per row; level 1000 at <strong>48 ms</strong>.</li>' +
      '<li>Early worlds give you 5 previews, a fair bag and a landing ghost.</li>' +
      '<li>The middle ages bring pre-filled rows and a shorter lock delay.</li>' +
      '<li>The last 100 levels show a single preview, no ghost and a <strong>garbage storm</strong> that keeps injecting rows.</li>' +
      '</ul>' +
      '<h3>Languages</h3>' +
      '<p>English, Español, Français, Deutsch, Italiano and Português — switch any time from the top bar.</p>',

    /* world naming (10 realms × 10 qualifiers = 100 worlds) */
    worldLink: 'of',
    worldNoun: ['Kingdom', 'Castle', 'Keep', 'Fortress', 'Valley', 'Forest', 'Citadel', 'Dungeon', 'Tower', 'Realm'],
    worldQual: ['Fire', 'Ice', 'Iron', 'Shadow', 'Frost', 'Sword', 'Moon', 'Storm', 'Dragon', 'Blood'],

    /* 10 ranks, 100 levels each */
    tiers: ['Page', 'Squire', 'Knight', 'Baron', 'Viscount', 'Count', 'Duke', 'King', 'Emperor', 'Legend']
  };
})(typeof window !== 'undefined' ? window : globalThis);
