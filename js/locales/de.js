/* ============================================================
   Locale: German (de) — Schlüssel entsprechen exakt en.js.
   ============================================================ */
(function (g) {
  'use strict';
  g.MT_Locales = g.MT_Locales || {};

  g.MT_Locales.de = {
    __name: 'Deutsch',
    __dir: 'ltr',

    brand: 'Medieval Tetris',
    tagline: '1000 Level von sehr leicht bis sehr schwer',

    /* menu */
    play: 'Spielen',
    continue: 'Fortsetzen',
    levelSelect: 'Levelauswahl',
    howToPlay: 'Spielanleitung',
    settings: 'Einstellungen',
    back: 'Zurück',
    retry: 'Level wiederholen',
    nextLevel: 'Nächstes Level',
    mainMenu: 'Hauptmenü',
    resume: 'Weiterspielen',
    quitToMenu: 'Zum Menü verlassen',

    /* HUD */
    hold: 'Halten',
    next: 'Nächste',
    level: 'Level',
    goal: 'Ziel',
    linesCleared: 'Reihen',
    score: 'Punkte',
    best: 'Bestwert',
    combo: 'Combo',
    levelScore: 'Level-Punkte',
    difficulty: 'Schwierigkeit',
    veryEasy: 'Sehr leicht',
    veryHard: 'Sehr schwer',
    controls: 'Steuerung',

    ctlMove: 'Bewegen',
    ctlSoft: 'Weicher Fall',
    ctlRotate: 'Drehen',
    ctlRotateCCW: 'Nach links drehen',
    ctlDrop: 'Harter Fall',
    ctlHold: 'Halten',
    ctlPause: 'Pause',
    ctlMute: 'Stummschalten',

    /* top bar titles */
    language: 'Sprache',
    sound: 'Ton',
    pause: 'Pause',

    /* settings */
    unlockAll: 'Alle Level freischalten (freies Spiel)',
    ghost: 'Landevorschau (Geisterstein)',
    resetProgress: 'Fortschritt löschen',

    /* dynamic strings ({vars} are replaced at runtime) */
    progressFoot: '{done} von 1000 Leveln freigeschaltet',
    menuProgress: 'Deine Quest reicht bis Level {n} · Bestwert {score}',
    worldLabel: 'Welt {n}',
    speedLine: '{ms} ms pro Reihe · {das} ms Reaktionszeit',
    goalLabel: '{n} Reihen löschen',
    scoreLabel: 'Punkte: {score}',
    levelClearText: '{lines} Reihen gelöscht · {points} Punkte',
    gameOverText: 'Deine Burg ist in Level {n} gefallen.',
    victoryText: 'Du hast alle 1000 Level erobert!',
    pausedText: 'Das Reich wartet auf dich.',
    bestLabel: 'Bestwert auf diesem Level: {score}',
    confirmReset: 'Deine freigeschalteten Level, Punktestände und Einstellungen löschen?',
    lockedToast: 'Schließe zuerst Level {n} ab, um dieses freizuschalten',
    pageOf: 'Seite {a} von {b}',
    linesShort: '{n} Reihen',

    /* banners */
    levelClearTitle: 'Level geschafft!',
    gameOverTitle: 'Spiel vorbei',
    pausedTitle: 'Pausiert',
    victoryTitle: 'Es lebe der Champion!',

    /* line-clear callouts */
    clear1: 'Einfach',
    clear2: 'Doppel',
    clear3: 'Dreifach',
    clear4: 'TETRIS',
    clearTspin: 'T-Spin',
    clearTspin2: 'T-Spin Doppel',
    comboCall: '{n}× Combo',
    b2bCall: 'Back-to-Back!',

    /* level modifiers */
    mod_fairbag: 'Faire Tasche',
    mod_garbage_start: 'Vorgefüllte Reihen',
    mod_garbage_storm: 'Müllsturm',
    mod_blind_next: 'Nur eine Vorschau',
    mod_no_ghost: 'Kein Geisterstein',

    /* how to play (HTML) */
    howto:
      '<h3>Ziel</h3>' +
      '<p>Fallende Tetrominos müssen auf der Burgmauer gestapelt werden. Schließe eine vollständige Steinreihe ab und sie wird <strong>zerstört</strong>. Lösche die vom Level geforderte Anzahl von Reihen, um das Tor zum nächsten Level zu öffnen.</p>' +
      '<h3>Steuerung</h3>' +
      '<ul>' +
      '<li><kbd>←</kbd> <kbd>→</kbd> oder <kbd>A</kbd> <kbd>D</kbd> — bewegt den Spielstein</li>' +
      '<li><kbd>↓</kbd> oder <kbd>S</kbd> — weicher Fall</li>' +
      '<li><kbd>↑</kbd>/<kbd>X</kbd> — im Uhrzeigersinn drehen, <kbd>Z</kbd>/<kbd>Ctrl</kbd> — gegen den Uhrzeigersinn</li>' +
      '<li><kbd>Space</kbd> — harter Fall, <kbd>C</kbd>/<kbd>Shift</kbd> — Spielstein halten</li>' +
      '<li><kbd>P</kbd> oder <kbd>Esc</kbd> — Pause, <kbd>M</kbd> — stummschalten</li>' +
      '<li>Auf Touch-Geräten das Steuerfeld auf dem Bildschirm nutzen oder über das Spielfeld wischen.</li>' +
      '</ul>' +
      '<h3>Punkte</h3>' +
      '<ul>' +
      '<li>Einfach 100 · Doppel 300 · Dreifach 500 · <strong>Tetris 800</strong></li>' +
      '<li>T-Spin- und Back-to-Back-Boni vervielfachen deine Punkte</li>' +
      '<li>Combos stapeln sich: Jede zusätzliche Reihe in einer Kette bringt mehr</li>' +
      '<li>Weicher Fall +1 pro Feld, harter Fall +2 pro Feld</li>' +
      '<li>Jedes Level vervielfacht deine Punkte von 1,00× bis 3,00×</li>' +
      '</ul>' +
      '<h3>Die 1000 Level</h3>' +
      '<ul>' +
      '<li><strong>100 Welten × 10 Level</strong>, gegliedert in 10 Ränge von Page bis Legende.</li>' +
      '<li>Level 1 fällt mit 1000 ms pro Reihe; Level 1000 mit <strong>48 ms</strong>.</li>' +
      '<li>Frühe Welten geben dir 5 Vorschauen, eine faire Tasche und eine Landevorschau.</li>' +
      '<li>Die mittleren Zeiten bringen vorgefüllte Reihen und eine kürzere Festsetzverzögerung.</li>' +
      '<li>Die letzten 100 Level zeigen nur eine Vorschau, keine Landevorschau und einen <strong>Müllsturm</strong>, der ständig Reihen einspeist.</li>' +
      '</ul>' +
      '<h3>Sprachen</h3>' +
      '<p>English, Español, Français, Deutsch, Italiano und Português — jederzeit über die obere Leiste wechseln.</p>',

    /* world naming (10 realms × 10 qualifiers = 100 worlds) */
    worldLink: 'des',
    worldNoun: ['Reich', 'Burg', 'Feste', 'Festung', 'Tal', 'Wald', 'Zitadelle', 'Verlies', 'Turm', 'Land'],
    worldQual: ['Feuers', 'Eises', 'Eisens', 'Schattens', 'Frostes', 'Schwertes', 'Mondes', 'Sturms', 'Drachens', 'Blutes'],

    /* 10 ranks, 100 levels each */
    tiers: ['Page', 'Knappe', 'Ritter', 'Baron', 'Vizegraf', 'Graf', 'Herzog', 'König', 'Kaiser', 'Legende']
  };
})(typeof window !== 'undefined' ? window : globalThis);
