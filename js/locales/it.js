/* ============================================================
   Locale: Italiano (it) — traduzione di riferimento en.js.
   Stessi identichi chiavi di en.js, solo valori tradotti.
   ============================================================ */
(function (g) {
  'use strict';
  g.MT_Locales = g.MT_Locales || {};

  g.MT_Locales.it = {
    __name: 'Italiano',
    __dir: 'ltr',

    brand: 'Medieval Tetris',
    tagline: '1000 livelli, dal molto facile al molto difficile',

    /* menu */
    play: 'Gioca',
    continue: 'Continua',
    levelSelect: 'Selezione livelli',
    howToPlay: 'Come giocare',
    settings: 'Impostazioni',
    back: 'Indietro',
    retry: 'Riprova livello',
    nextLevel: 'Livello successivo',
    mainMenu: 'Menu principale',
    resume: 'Riprendi',
    quitToMenu: 'Torna al menu',

    /* HUD */
    hold: 'Riserva',
    next: 'Prossimi',
    level: 'Livello',
    goal: 'Obiettivo',
    linesCleared: 'Righe',
    score: 'Punteggio',
    best: 'Record',
    combo: 'Combo',
    levelScore: 'Punteggio livello',
    difficulty: 'Difficoltà',
    veryEasy: 'Molto facile',
    veryHard: 'Molto difficile',
    controls: 'Comandi',

    ctlMove: 'Muovi',
    ctlSoft: 'Discesa morbida',
    ctlRotate: 'Rotazione',
    ctlRotateCCW: 'Ruota a sinistra',
    ctlDrop: 'Discesa rapida',
    ctlHold: 'Riserva',
    ctlPause: 'Pausa',
    ctlMute: 'Disattiva audio',

    /* top bar titles */
    language: 'Lingua',
    sound: 'Audio',
    pause: 'Pausa',

    /* settings */
    unlockAll: 'Sblocca ogni livello (gioco libero)',
    ghost: 'Fantasma di atterraggio',
    resetProgress: 'Cancella progressi',

    /* dynamic strings ({vars} are replaced at runtime) */
    progressFoot: '{done} livelli su 1000 sbloccati',
    menuProgress: 'La tua impresa è arrivata al livello {n} · Punteggio record {score}',
    worldLabel: 'Mondo {n}',
    speedLine: '{ms} ms per riga · risposta {das} ms',
    goalLabel: 'Elimina {n} righe',
    scoreLabel: 'Punteggio: {score}',
    levelClearText: '{lines} righe eliminate · {points} punti',
    gameOverText: 'Il tuo castello è caduto al livello {n}.',
    victoryText: 'Hai conquistato tutti i 1000 livelli!',
    pausedText: 'Il regno ti aspetta.',
    bestLabel: 'Record su questo livello: {score}',
    confirmReset: 'Cancellare i livelli sbloccati, i punteggi e le impostazioni?',
    lockedToast: 'Completa prima il livello {n} per sbloccare questo',
    pageOf: 'Pagina {a} di {b}',
    linesShort: '{n} righe',

    /* banners */
    levelClearTitle: 'Livello superato!',
    gameOverTitle: 'Fine partita',
    pausedTitle: 'In pausa',
    victoryTitle: 'Evviva il campione!',

    /* line-clear callouts */
    clear1: 'Singola',
    clear2: 'Doppia',
    clear3: 'Tripla',
    clear4: 'TETRIS',
    clearTspin: 'T-Spin',
    clearTspin2: 'T-Spin Doppio',
    comboCall: '{n}× Combo',
    b2bCall: 'Back-to-back!',

    /* level modifiers */
    mod_fairbag: 'Borsa equa',
    mod_garbage_start: 'Righe precompilate',
    mod_garbage_storm: 'Tempesta di rifiuti',
    mod_blind_next: 'Anteprima unica',
    mod_no_ghost: 'Nessun fantasma',

    /* how to play (HTML) */
    howto:
      '<h3>Obiettivo</h3>' +
      '<p>I tetromini in caduta devono essere impilati all’interno del muro del castello. Componi una riga completa di pietra ed essa verrà <strong>distrutta</strong>. Elimina il numero di righe richiesto dal livello per aprire il cancello verso il successivo.</p>' +
      '<h3>Comandi</h3>' +
      '<ul>' +
      '<li><kbd>←</kbd> <kbd>→</kbd> o <kbd>A</kbd> <kbd>D</kbd> — sposta il pezzo</li>' +
      '<li><kbd>↓</kbd> o <kbd>S</kbd> — discesa morbida</li>' +
      '<li><kbd>↑</kbd>/<kbd>X</kbd> — rotazione oraria, <kbd>Z</kbd>/<kbd>Ctrl</kbd> — antioraria</li>' +
      '<li><kbd>Spazio</kbd> — discesa rapida, <kbd>C</kbd>/<kbd>Shift</kbd> — metti in riserva un pezzo</li>' +
      '<li><kbd>P</kbd> o <kbd>Esc</kbd> — pausa, <kbd>M</kbd> — disattiva audio</li>' +
      '<li>Su dispositivi tattili usa il comando a schermo o scorri sulla scacchiera.</li>' +
      '</ul>' +
      '<h3>Punteggio</h3>' +
      '<ul>' +
      '<li>Singola 100 · Doppia 300 · Tripla 500 · <strong>Tetris 800</strong></li>' +
      '<li>I bonus T-spin e back-to-back moltiplicano i tuoi punti</li>' +
      '<li>Le combo si accumulano: ogni riga extra in una catena vale di più</li>' +
      '<li>Discesa morbida +1 per cella, discesa rapida +2 per cella</li>' +
      '<li>Ogni livello moltiplica il tuo punteggio da 1,00× a 3,00×</li>' +
      '</ul>' +
      '<h3>I 1000 livelli</h3>' +
      '<ul>' +
      '<li><strong>100 mondi × 10 livelli</strong>, raggruppati in 10 gradi dal Paggio alla Leggenda.</li>' +
      '<li>Il livello 1 cade a 1000 ms per riga; il livello 1000 a <strong>48 ms</strong>.</li>' +
      '<li>I mondi iniziali ti offrono 5 anteprime, una borsa equa e un fantasma di atterraggio.</li>' +
      '<li>Le età centrali portano righe precompilate e un ritardo di blocco più breve.</li>' +
      '<li>Gli ultimi 100 livelli mostrano un’anteprima sola, nessun fantasma e una <strong>tempesta di rifiuti</strong> che continua a iniettare righe.</li>' +
      '</ul>' +
      '<h3>Lingue</h3>' +
      '<p>English, Español, Français, Deutsch, Italiano e Português — cambia in qualsiasi momento dalla barra in alto.</p>',

    /* world naming (10 realms × 10 qualifiers = 100 worlds) */
    worldLink: 'di',
    worldNoun: ['Regno', 'Castello', 'Rocca', 'Fortezza', 'Valle', 'Foresta', 'Cittadella', 'Prigione', 'Torre', 'Dominio'],
    worldQual: ['Fuoco', 'Ghiaccio', 'Ferro', 'Ombra', 'Brina', 'Spada', 'Luna', 'Tempesta', 'Dragone', 'Sangue'],

    /* 10 ranks, 100 levels each */
    tiers: ['Paggio', 'Scudiero', 'Cavaliere', 'Barone', 'Visconte', 'Conte', 'Duca', 'Re', 'Imperatore', 'Leggenda']
  };
})(typeof window !== 'undefined' ? window : globalThis);
