/* ============================================================
   Locale: Português (pt) — tradução neutra (BR/PT).
   Defines exactly the same keys as en.js.
   ============================================================ */
(function (g) {
  'use strict';
  g.MT_Locales = g.MT_Locales || {};

  g.MT_Locales.pt = {
    __name: 'Português',
    __dir: 'ltr',

    brand: 'Medieval Tetris',
    tagline: '1000 níveis do muito fácil ao muito difícil',

    /* menu */
    play: 'Jogar',
    continue: 'Continuar',
    levelSelect: 'Selecionar nível',
    howToPlay: 'Como jogar',
    settings: 'Definições',
    back: 'Voltar',
    retry: 'Repetir nível',
    nextLevel: 'Próximo nível',
    mainMenu: 'Menu principal',
    resume: 'Retomar',
    quitToMenu: 'Sair para o menu',

    /* HUD */
    hold: 'Reserva',
    next: 'Próximas',
    level: 'Nível',
    goal: 'Objetivo',
    linesCleared: 'Linhas',
    score: 'Pontuação',
    best: 'Recorde',
    combo: 'Combo',
    levelScore: 'Pontuação do nível',
    difficulty: 'Dificuldade',
    veryEasy: 'Muito fácil',
    veryHard: 'Muito difícil',
    controls: 'Controlos',

    ctlMove: 'Mover',
    ctlSoft: 'Queda suave',
    ctlRotate: 'Rodar',
    ctlRotateCCW: 'Rodar à esquerda',
    ctlDrop: 'Queda rápida',
    ctlHold: 'Reservar',
    ctlPause: 'Pausa',
    ctlMute: 'Silenciar',

    /* top bar titles */
    language: 'Idioma',
    sound: 'Som',
    pause: 'Pausa',

    /* settings */
    unlockAll: 'Desbloquear todos os níveis (jogo livre)',
    ghost: 'Peça fantasma de aterragem',
    resetProgress: 'Apagar progresso',

    /* dynamic strings ({vars} are replaced at runtime) */
    progressFoot: '{done} de 1000 níveis desbloqueados',
    menuProgress: 'A tua aventura chegou ao nível {n} · Melhor pontuação {score}',
    worldLabel: 'Mundo {n}',
    speedLine: '{ms} ms por linha · {das} ms de resposta',
    goalLabel: 'Limpar {n} linhas',
    scoreLabel: 'Pontuação: {score}',
    levelClearText: '{lines} linhas limpas · {points} pontos',
    gameOverText: 'A tua fortaleza caiu no nível {n}.',
    victoryText: 'Conquistaste todos os 1000 níveis!',
    pausedText: 'O reino espera por ti.',
    bestLabel: 'Melhor neste nível: {score}',
    confirmReset: 'Apagar os níveis desbloqueados, as pontuações e as definições?',
    lockedToast: 'Termina primeiro o nível {n} para desbloquear este',
    pageOf: 'Página {a} de {b}',
    linesShort: '{n} linhas',

    /* banners */
    levelClearTitle: 'Nível concluído!',
    gameOverTitle: 'Fim de jogo',
    pausedTitle: 'Pausado',
    victoryTitle: 'Viva o campeão!',

    /* line-clear callouts */
    clear1: 'Simples',
    clear2: 'Dupla',
    clear3: 'Tripla',
    clear4: 'TETRIS',
    clearTspin: 'T-Spin',
    clearTspin2: 'T-Spin Duplo',
    comboCall: '{n}× Combo',
    b2bCall: 'Back-to-back!',

    /* level modifiers */
    mod_fairbag: 'Saco justo',
    mod_garbage_start: 'Linhas pré-preenchidas',
    mod_garbage_storm: 'Tempestade de lixo',
    mod_blind_next: 'Uma prévia',
    mod_no_ghost: 'Sem fantasma',

    /* how to play (HTML) */
    howto:
      '<h3>Objetivo</h3>' +
      '<p>Os tetrominós que caem devem ser empilhados dentro da muralha do castelo. Completa uma linha inteira de pedra e ela é <strong>destruída</strong>. Limpa o número de linhas exigido pelo nível para abrir o portão para o seguinte.</p>' +
      '<h3>Controlos</h3>' +
      '<ul>' +
      '<li><kbd>←</kbd> <kbd>→</kbd> ou <kbd>A</kbd> <kbd>D</kbd> — mover a peça</li>' +
      '<li><kbd>↓</kbd> ou <kbd>S</kbd> — queda suave</li>' +
      '<li><kbd>↑</kbd>/<kbd>X</kbd> — rodar no sentido horário, <kbd>Z</kbd>/<kbd>Ctrl</kbd> — no sentido anti-horário</li>' +
      '<li><kbd>Space</kbd> — queda rápida, <kbd>C</kbd>/<kbd>Shift</kbd> — reservar uma peça</li>' +
      '<li><kbd>P</kbd> ou <kbd>Esc</kbd> — pausa, <kbd>M</kbd> — silenciar</li>' +
      '<li>Em dispositivos táteis, usa o comando na tela ou desliza o dedo sobre o tabuleiro.</li>' +
      '</ul>' +
      '<h3>Pontuação</h3>' +
      '<ul>' +
      '<li>Simples 100 · Dupla 300 · Tripla 500 · <strong>Tetris 800</strong></li>' +
      '<li>Os bónus de T-spin e back-to-back multiplicam os teus pontos</li>' +
      '<li>Os combos acumulam-se: cada linha extra numa sequência acrescenta mais</li>' +
      '<li>Queda suave +1 por célula, queda rápida +2 por célula</li>' +
      '<li>Cada nível multiplica a tua pontuação de 1.00× a 3.00×</li>' +
      '</ul>' +
      '<h3>Os 1000 níveis</h3>' +
      '<ul>' +
      '<li><strong>100 mundos × 10 níveis</strong>, agrupados em 10 patentes, de Pajem a Lenda.</li>' +
      '<li>O nível 1 cai a 1000 ms por linha; o nível 1000 a <strong>48 ms</strong>.</li>' +
      '<li>Os mundos iniciais dão-te 5 prévias, um saco justo e uma peça fantasma.</li>' +
      '<li>As idades médias trazem linhas pré-preenchidas e um menor atraso de encaixe.</li>' +
      '<li>Os últimos 100 níveis mostram uma única prévia, sem fantasma e uma <strong>tempestade de lixo</strong> que continua a injetar linhas.</li>' +
      '</ul>' +
      '<h3>Idiomas</h3>' +
      '<p>English, Español, Français, Deutsch, Italiano e Português — muda de idioma a qualquer momento pela barra superior.</p>',

    /* world naming (10 realms × 10 qualifiers = 100 worlds) */
    worldLink: 'de',
    worldNoun: ['Reino', 'Castelo', 'Fortaleza', 'Muralha', 'Vale', 'Floresta', 'Cidadela', 'Masmorra', 'Torre', 'Domínio'],
    worldQual: ['Fogo', 'Gelo', 'Ferro', 'Sombra', 'Geada', 'Espada', 'Lua', 'Tempestade', 'Dragão', 'Sangue'],

    /* 10 ranks, 100 levels each */
    tiers: ['Pajem', 'Escudeiro', 'Cavaleiro', 'Barão', 'Visconde', 'Conde', 'Duque', 'Rei', 'Imperador', 'Lenda']
  };
})(typeof window !== 'undefined' ? window : globalThis);
