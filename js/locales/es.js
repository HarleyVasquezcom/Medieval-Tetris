/* ============================================================
   Locale: Español (es)
   ============================================================ */
(function (g) {
  'use strict';
  g.MT_Locales = g.MT_Locales || {};

  g.MT_Locales.es = {
    __name: 'Español',
    __dir: 'ltr',

    brand: 'Tetris Medieval',
    tagline: '1000 niveles de muy fácil a muy difícil',

    /* menú */
    play: 'Jugar',
    continue: 'Continuar',
    levelSelect: 'Elegir nivel',
    howToPlay: 'Cómo jugar',
    settings: 'Ajustes',
    back: 'Atrás',
    retry: 'Reintentar nivel',
    nextLevel: 'Siguiente nivel',
    mainMenu: 'Menú principal',
    resume: 'Reanudar',
    quitToMenu: 'Salir al menú',

    /* HUD */
    hold: 'Reserva',
    next: 'Siguientes',
    level: 'Nivel',
    goal: 'Objetivo',
    linesCleared: 'Líneas',
    score: 'Puntos',
    best: 'Récord',
    combo: 'Combo',
    levelScore: 'Puntos del nivel',
    difficulty: 'Dificultad',
    veryEasy: 'Muy fácil',
    veryHard: 'Muy difícil',
    controls: 'Controles',

    ctlMove: 'Mover',
    ctlSoft: 'Caída suave',
    ctlRotate: 'Rotar',
    ctlRotateCCW: 'Rotar izq.',
    ctlDrop: 'Caída total',
    ctlHold: 'Reservar',
    ctlPause: 'Pausa',
    ctlMute: 'Silenciar',

    /* títulos de la barra superior */
    language: 'Idioma',
    sound: 'Sonido',
    pause: 'Pausa',

    /* ajustes */
    unlockAll: 'Desbloquear todos los niveles (modo libre)',
    ghost: 'Pieza fantasma',
    resetProgress: 'Borrar progreso',

    /* cadenas dinámicas ({vars} se reemplazan en tiempo de ejecución) */
    progressFoot: '{done} de 1000 niveles desbloqueados',
    menuProgress: 'Tu aventura llega hasta el nivel {n} · Récord {score}',
    worldLabel: 'Mundo {n}',
    speedLine: '{ms} ms por fila · respuesta de {das} ms',
    goalLabel: 'Limpiar {n} líneas',
    scoreLabel: 'Puntos: {score}',
    levelClearText: '{lines} líneas limpiadas · {points} puntos',
    gameOverText: 'Tu castillo ha caído en el nivel {n}.',
    victoryText: '¡Has conquistado los 1000 niveles!',
    pausedText: 'El reino te espera.',
    bestLabel: 'Récord en este nivel: {score}',
    confirmReset: '¿Borrar niveles desbloqueados, puntos y ajustes?',
    lockedToast: 'Termina primero el nivel {n} para desbloquear este',
    pageOf: 'Página {a} de {b}',
    linesShort: '{n} líneas',

    /* banners */
    levelClearTitle: '¡Nivel superado!',
    gameOverTitle: 'Fin de la partida',
    pausedTitle: 'Pausa',
    victoryTitle: '¡Larga vida al campeón!',

    /* avisos de línea */
    clear1: 'Simple',
    clear2: 'Doble',
    clear3: 'Triple',
    clear4: 'TETRIS',
    clearTspin: 'T-Spin',
    clearTspin2: 'T-Spin doble',
    comboCall: 'Combo de {n}×',
    b2bCall: '¡Seguidas!',

    /* modificadores de nivel */
    mod_fairbag: 'Bolsa justa',
    mod_garbage_start: 'Filas iniciales',
    mod_garbage_storm: 'Tormenta de bloques',
    mod_blind_next: 'Una pieza previa',
    mod_no_ghost: 'Sin fantasma',

    /* cómo jugar (HTML) */
    howto:
      '<h3>Objetivo</h3>' +
      '<p>Las tetrominóes deben apilarse dentro del muro del castillo. Completa una fila entera de piedra y será <strong>destruida</strong>. Limpia las líneas que pida el nivel para abrir la puerta al siguiente.</p>' +
      '<h3>Controles</h3>' +
      '<ul>' +
      '<li><kbd>←</kbd> <kbd>→</kbd> o <kbd>A</kbd> <kbd>D</kbd> — mover la pieza</li>' +
      '<li><kbd>↓</kbd> o <kbd>S</kbd> — caída suave</li>' +
      '<li><kbd>↑</kbd>/<kbd>X</kbd> — girar a la derecha, <kbd>Z</kbd>/<kbd>Ctrl</kbd> — a la izquierda</li>' +
      '<li><kbd>Espacio</kbd> — caída total, <kbd>C</kbd>/<kbd>Mayús</kbd> — reservar pieza</li>' +
      '<li><kbd>P</kbd> o <kbd>Esc</kbd> — pausa, <kbd>M</kbd> — silenciar</li>' +
      '<li>En pantallas táctiles usa el pad de la pantalla o desliza el dedo sobre el tablero.</li>' +
      '</ul>' +
      '<h3>Puntuación</h3>' +
      '<ul>' +
      '<li>Simple 100 · Doble 300 · Triple 500 · <strong>Tetris 800</strong></li>' +
      '<li>Los bonus de T-Spin y de seguidas multiplican tus puntos</li>' +
      '<li>Los combos se acumulan: cada fila extra de la cadena suma más</li>' +
      '<li>Caída suave +1 por celda, caída total +2 por celda</li>' +
      '<li>Cada nivel multiplica tu puntuación de 1,00× a 3,00×</li>' +
      '</ul>' +
      '<h3>Los 1000 niveles</h3>' +
      '<ul>' +
      '<li><strong>100 mundos × 10 niveles</strong>, agrupados en 10 rangos: de Paje a Leyenda.</li>' +
      '<li>El nivel 1 cae a 1000 ms por fila; el nivel 1000 a <strong>48 ms</strong>.</li>' +
      '<li>Los primeros mundos dan 5 piezas de vista previa, bolsa justa y pieza fantasma.</li>' +
      '<li>La media edad trae filas ya llenas y menos margen de bloqueo.</li>' +
      '<li>Los últimos 100 niveles muestran una sola pieza previa, sin fantasma y una <strong>tormenta de bloques</strong> que no deja de subir filas.</li>' +
      '</ul>' +
      '<h3>Idiomas</h3>' +
      '<p>Inglés, Español, Français, Deutsch, Italiano y Português: cámbialos cuando quieras desde la barra superior.</p>',

    /* nombrado de mundos (10 reinos × 10 calificativos = 100 mundos) */
    worldLink: 'de',
    worldNoun: ['Reino', 'Castillo', 'Fortín', 'Fortaleza', 'Valle', 'Bosque', 'Ciudadela', 'Mazmorra', 'Torre', 'Señorío'],
    worldQual: ['Fuego', 'Hielo', 'Hierro', 'Sombra', 'Escarcha', 'Espada', 'Luna', 'Tormenta', 'Dragón', 'Sangre'],

    /* 10 rangos de 100 niveles */
    tiers: ['Paje', 'Escudero', 'Caballero', 'Barón', 'Vizconde', 'Conde', 'Duque', 'Rey', 'Emperador', 'Leyenda']
  };
})(typeof window !== 'undefined' ? window : globalThis);
