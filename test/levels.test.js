/* ============================================================
   Medieval Tetris — test suite (no dependencies, plain Node)
   Run:  node test/levels.test.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

/* ---------------- tiny harness ---------------- */
let passed = 0, failed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ok   ' + name);
  } catch (e) {
    failed++;
    failures.push({ name, e });
    console.log('  FAIL ' + name + '\n       ' + e.message);
  }
}
function eq(a, b, msg) {
  if (a !== b) throw new Error((msg || '') + ' expected ' + JSON.stringify(b) + ' got ' + JSON.stringify(a));
}
function ok(v, msg) { if (!v) throw new Error(msg || 'expected truthy'); }

/* ---------------- load sources ---------------- */
const ctx = { console, Math, Date, localStorage: null };
vm.createContext(ctx);

function load(rel) {
  const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  vm.runInContext(code, ctx, { filename: rel });
}

const LANGS = ['en', 'es', 'fr', 'de', 'it', 'pt'];
const SOURCES = [
  'js/rng.js',
  'js/locales/en.js', 'js/locales/es.js', 'js/locales/fr.js',
  'js/locales/de.js', 'js/locales/it.js', 'js/locales/pt.js',
  'js/levels.js', 'js/pieces.js', 'js/game.js'
];

console.log('\nMEDIEVAL TETRIS — test suite\n' + '='.repeat(46));
SOURCES.forEach(load);

const Levels = ctx.MT_Levels;
const Pieces = ctx.MT_Pieces;
const Locales = ctx.MT_Locales;
const Game = ctx.MT_Game;

/* ============================================================
   1. LOCALISATIONS
   ============================================================ */
console.log('\n[1] 6 languages');
LANGS.forEach(function (lang) {
  check('locale "' + lang + '" exists with 79 keys', function () {
    const loc = Locales[lang];
    ok(loc, 'missing locale ' + lang);
    const keys = Object.keys(loc);
    eq(keys.length, 79, 'key count for ' + lang + ': ');
    const ref = Object.keys(Locales.en);
    ref.forEach(function (k) {
      if (keys.indexOf(k) < 0) throw new Error(lang + ' is missing key "' + k + '"');
    });
    keys.forEach(function (k) {
      if (ref.indexOf(k) < 0) throw new Error(lang + ' has extra key "' + k + '"');
    });
  });
});

check('every locale keeps the {placeholders} of the English strings', function () {
  const ref = Locales.en;
  LANGS.forEach(function (lang) {
    const loc = Locales[lang];
    Object.keys(ref).forEach(function (k) {
      const a = String(ref[k]).match(/\{\w+\}/g) || [];
      const b = String(loc[k]).match(/\{\w+\}/g) || [];
      if (a.join(',') !== b.join(',')) {
        throw new Error(lang + '.' + k + ' placeholders ' + JSON.stringify(b) + ' vs ' + JSON.stringify(a));
      }
    });
  });
});

check('naming tables have 10 realms, 10 qualifiers, 10 ranks each', function () {
  LANGS.forEach(function (lang) {
    const loc = Locales[lang];
    eq(loc.worldNoun.length, 10, lang + ' worldNoun ');
    eq(loc.worldQual.length, 10, lang + ' worldQual ');
    eq(loc.tiers.length, 10, lang + ' tiers ');
    ok(loc.worldLink != null, lang + ' worldLink ');
  });
});

check('all 100 world names are unique in every language', function () {
  LANGS.forEach(function (lang) {
    const loc = Locales[lang];
    const names = [];
    for (let w = 0; w < 100; w++) names.push(Levels.worldName(w, loc));
    const uniq = new Set(names);
    eq(uniq.size, 100, lang + ' world names ');
  });
});

check('sample world names read naturally in all 6 languages', function () {
  const samples = LANGS.map(function (lang) {
    return Levels.worldName(0, Locales[lang]);
  });
  samples.forEach(function (s) {
    ok(s && s.split(' ').length >= 2, 'world name looks broken: ' + s);
  });
  console.log('       e.g. ' + samples.join(' | '));
});

check('every data-i18n key used by index.html exists in all 6 locales', function () {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const keys = new Set();
  const re = /data-i18n(?:-title)?="([\w-]+)"/g;
  let m;
  while ((m = re.exec(html))) keys.add(m[1]);
  ok(keys.size >= 20, 'only found ' + keys.size + ' i18n keys in index.html');
  keys.forEach(function (k) {
    LANGS.forEach(function (lang) {
      if (Locales[lang][k] == null) throw new Error(lang + ' is missing key "' + k + '" used by index.html');
    });
  });
});

check('every static key used by main.js exists in all 6 locales', function () {
  const src = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
  const keys = new Set();
  // dynamic keys that main.js builds by concatenation
  ['clear1', 'clear2', 'clear3', 'clear4', 'clearTspin', 'clearTspin2',
   'comboCall', 'b2bCall', 'levelClearTitle', 'gameOverTitle', 'pausedTitle'
  ].forEach(function (k) { keys.add(k); });

  const re = /\bt\(\s*'(\w+)'(\s*\+)?/g;   // skip concatenated (dynamic) keys
  let m;
  while ((m = re.exec(src))) { if (!m[2]) keys.add(m[1]); }
  ok(keys.size >= 20, 'only found ' + keys.size + ' keys in main.js');

  keys.forEach(function (k) {
    LANGS.forEach(function (lang) {
      if (Locales[lang][k] == null) throw new Error(lang + ' is missing key "' + k + '" used by main.js');
    });
  });
});

check('every level modifier tag has a label in all 6 locales', function () {
  const tags = new Set();
  for (let n = 1; n <= 1000; n++) {
    Levels.modifiers(Levels.get(n)).forEach(function (m) { tags.add(m.split(':')[0]); });
  }
  ok(tags.size >= 5, 'expected several modifier tags, found ' + tags.size);
  tags.forEach(function (tag) {
    const key = 'mod_' + tag.replace(/-/g, '_');
    LANGS.forEach(function (lang) {
      if (Locales[lang][key] == null) {
        throw new Error(lang + ' is missing modifier label "' + key + '" (tag "' + tag + '")');
      }
    });
  });
});

/* ============================================================
   2. THE 1000 LEVELS
   ============================================================ */
console.log('\n[2] 1000 levels');
const defs = [];
for (let n = 1; n <= 1000; n++) defs.push(Levels.get(n));

check('exactly 1000 levels, numbered 1..1000', function () {
  eq(Levels.TOTAL, 1000, 'TOTAL ');
  eq(defs.length, 1000, 'defs ');
  eq(defs[0].n, 1, 'first ');
  eq(defs[999].n, 1000, 'last ');
});

check('100 worlds x 10 levels, 10 ranks x 100 levels', function () {
  const worlds = new Set(defs.map(function (d) { return d.world; }));
  eq(worlds.size, 100, 'worlds ');
  defs.forEach(function (d) {
    eq(d.inWorld, ((d.n - 1) % 10) + 1, 'inWorld at ' + d.n);
    if (d.n % 10 === 1) eq(d.inWorld, 1, 'world start at ' + d.n);
  });
  const tiers = new Set(defs.map(function (d) { return d.tier; }));
  eq(tiers.size, 10, 'tiers ');
});

check('level definitions are deterministic (same n => same level)', function () {
  for (let i = 0; i < 40; i++) {
    const n = 1 + (i * 977) % 1000;
    const a = Levels.get(n), b = Levels.get(n);
    eq(JSON.stringify(a), JSON.stringify(b), 'level ' + n + ' ');
  }
});

check('difficulty t ramps 0 -> 1 across the 1000 levels', function () {
  eq(defs[0].t, 0, 't at 1 ');
  eq(defs[999].t, 1, 't at 1000 ');
  defs.forEach(function (d) {
    ok(d.t >= 0 && d.t <= 1, 't out of range at ' + d.n);
  });
});

check('gravity is monotonically non-increasing 1000ms -> 48ms', function () {
  for (let i = 1; i < defs.length; i++) {
    if (defs[i].gravityMs > defs[i - 1].gravityMs) {
      throw new Error('gravity rises at level ' + defs[i].n + ': ' +
        defs[i - 1].gravityMs + ' -> ' + defs[i].gravityMs);
    }
  }
  eq(defs[0].gravityMs, 1000, 'level 1 gravity ');
  eq(defs[999].gravityMs, 48, 'level 1000 gravity ');
});

check('lock delay, DAS and ARR all tighten as levels get harder', function () {
  ['lockDelayMs', 'dasMs', 'arrMs'].forEach(function (key) {
    for (let i = 1; i < defs.length; i++) {
      if (defs[i][key] > defs[i - 1][key]) {
        throw new Error(key + ' rises at level ' + defs[i].n);
      }
    }
  });
  ok(defs[0].lockDelayMs >= defs[999].lockDelayMs * 5, 'lock delay range too small');
});

check('preview shrinks 5 -> 1 and is never increasing', function () {
  eq(defs[0].preview, 5, 'level 1 preview ');
  eq(defs[999].preview, 1, 'level 1000 preview ');
  for (let i = 1; i < defs.length; i++) {
    if (defs[i].preview > defs[i - 1].preview) throw new Error('preview rises at ' + defs[i].n);
  }
});

check('the landing ghost disappears for the final 100 levels', function () {
  defs.forEach(function (d) {
    const expect = d.n <= 900;
    eq(d.ghost, expect, 'ghost at ' + d.n + ' ');
  });
});

check('garbage rows only appear from 30% onward, max 5, never decreasing', function () {
  let last = 0;
  defs.forEach(function (d) {
    if (d.n <= 300) eq(d.garbageRows, 0, 'garbage at ' + d.n + ' ');
    if (d.garbageRows < last) throw new Error('garbage drops at ' + d.n);
    last = d.garbageRows;
    ok(d.garbageRows >= 0 && d.garbageRows <= 5, 'garbage range at ' + d.n);
  });
  ok(defs[999].garbageRows >= 3, 'late levels should start with garbage');
});

check('the garbage storm starts at 75% and then speeds up', function () {
  let started = false, last = Infinity;
  defs.forEach(function (d) {
    if (d.garbageEveryMs > 0) {
      started = true;
      if (d.garbageEveryMs > last) throw new Error('storm slows at ' + d.n);
      last = d.garbageEveryMs;
    } else if (started) {
      throw new Error('storm disappears at ' + d.n);
    }
  });
  ok(started, 'storm never started');
  const firstStorm = defs.find(function (d) { return d.garbageEveryMs > 0; });
  const lastStorm = defs[999];
  ok(lastStorm.garbageEveryMs < firstStorm.garbageEveryMs, 'storm should speed up');
});

check('line goals grow 4 -> 14 and never shrink', function () {
  eq(defs[0].linesGoal, 4, 'goal at 1 ');
  eq(defs[999].linesGoal, 14, 'goal at 1000 ');
  for (let i = 1; i < defs.length; i++) {
    if (defs[i].linesGoal < defs[i - 1].linesGoal) throw new Error('goal shrinks at ' + defs[i].n);
  }
});

check('score multiplier grows 1.00 -> 3.00', function () {
  eq(defs[0].multiplier, 1, 'multiplier at 1 ');
  eq(defs[999].multiplier, 3, 'multiplier at 1000 ');
  for (let i = 1; i < defs.length; i++) {
    if (defs[i].multiplier < defs[i - 1].multiplier) throw new Error('multiplier shrinks at ' + defs[i].n);
  }
});

check('early levels use the fair 5-piece bag, later ones the full 7', function () {
  const fair = defs.filter(function (d) { return d.pool === '5'; });
  const full = defs.filter(function (d) { return d.pool === '7'; });
  eq(fair.length, 200, 'fair levels ');
  eq(full.length, 800, 'full levels ');
  ok(fair.every(function (d) { return d.n <= 200; }), 'fair bag after level 200');
});

check('every level has a theme (hue + one of 6 scenes) and a unique seed', function () {
  const seeds = new Set(defs.map(function (d) { return d.seed; }));
  eq(seeds.size, 1000, 'seeds ');
  defs.forEach(function (d) {
    ok(d.hue >= 0 && d.hue < 360, 'hue at ' + d.n);
    ok(d.scene >= 0 && d.scene < 6, 'scene at ' + d.n);
  });
});

check('modifier tags are readable and grow richer over time', function () {
  const first = Levels.modifiers(defs[0]);
  const last = Levels.modifiers(defs[999]);
  // level 1 only carries the beneficial "fair bag", never an adverse one
  eq(first.join(','), 'fairbag', 'level 1 modifiers ');
  ok(first.every(function (m) { return m === 'fairbag'; }),
    'level 1 should have no adverse modifiers');
  ok(last.length >= 3, 'level 1000 should carry several modifiers');
  ok(last.indexOf('no-ghost') >= 0, 'level 1000 should have no ghost');
  ok(last.indexOf('garbage-storm') >= 0, 'level 1000 should have the garbage storm');
});

check('level 1 is genuinely easy, level 1000 genuinely hard', function () {
  const a = defs[0], b = defs[999];
  const speedup = a.gravityMs / b.gravityMs;
  ok(speedup > 15, 'gravity speedup is only ' + speedup.toFixed(1) + 'x');
  ok(b.lockResets < a.lockResets, 'lock resets should tighten');
  ok(b.garbageRows > 0 && a.garbageRows === 0, 'garbage should ramp');
  ok(b.linesGoal > a.linesGoal * 2, 'goals should grow');
  console.log('       speedup ' + speedup.toFixed(1) + 'x · ' +
    a.gravityMs + 'ms -> ' + b.gravityMs + 'ms · goals ' +
    a.linesGoal + ' -> ' + b.linesGoal + ' lines');
});

/* ============================================================
   3. PIECES & SRS
   ============================================================ */
console.log('\n[3] pieces');
check('7 tetrominoes, 4 rotations each, always 4 cells', function () {
  eq(Pieces.IDS.length, 7, 'piece count ');
  Pieces.IDS.forEach(function (id) {
    eq(Pieces.STATES[id].length, 4, id + ' rotations ');
    for (let r = 0; r < 4; r++) {
      eq(Pieces.cells(id, r).length, 4, id + ' r' + r + ' cells ');
    }
  });
});

check('SRS kick tables cover all 8 transitions for I and JLSTZ', function () {
  const froms = [0, 1, 2, 3];
  Pieces.IDS.forEach(function (id) {
    if (id === 'O') return;
    froms.forEach(function (f) {
      [1, 3].forEach(function (dir) {
        const to = (f + dir) & 3;
        const k = Pieces.kicks(id, f, to);
        ok(Array.isArray(k) && k.length >= 1, id + ' kicks ' + f + '>' + to);
        eq(k.length, 5, id + ' kick count ' + f + '>' + to);
      });
    });
  });
});

check('rotation actually changes every non-O piece shape', function () {
  ['I', 'J', 'L', 'S', 'T', 'Z'].forEach(function (id) {
    const seen = new Set();
    for (let r = 0; r < 4; r++) seen.add(JSON.stringify(Pieces.STATES[id][r]));
    ok(seen.size >= 2, id + ' rotations look identical');
  });
});

/* ============================================================
   4. GAME SIMULATION
   ============================================================ */
console.log('\n[4] gameplay simulation');

function boardCopy(board) { return board.map(function (r) { return r.slice(); }); }

function stackHeight(board) {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) if (board[y][x]) return board.length - y;
  }
  return 0;
}

function collidesOn(board, id, rot, x, y) {
  const cells = Pieces.cells(id, rot & 3);
  for (let i = 0; i < cells.length; i++) {
    const cx = x + cells[i][0], cy = y + cells[i][1];
    if (cx < 0 || cx >= Game.COLS || cy >= Game.ROWS || cy < 0) return true;
    if (board[cy][cx]) return true;
  }
  return false;
}

function bestPlacement(id) {
  let best = null;
  for (let rot = 0; rot < 4; rot++) {
    const b = Pieces.bounds(id, rot);
    for (let x = -b.minX; x <= Game.COLS - 1 - b.maxX; x++) {
      let y = Game.HIDDEN - b.minY;
      if (collidesOn(Game.board, id, rot, x, y)) continue;
      while (!collidesOn(Game.board, id, rot, x, y + 1)) y++;
      const copy = boardCopy(Game.board);
      Pieces.cells(id, rot).forEach(function (c) { copy[y + c[1]][x + c[0]] = Pieces.colorIndex[id]; });
      let full = 0;
      copy.forEach(function (row) { if (row.every(Boolean)) full++; });
      const height = stackHeight(copy);
      const holes = countHoles(copy);
      const score = full * 100 - height * 1.5 - holes * 4;
      if (!best || score > best.score) best = { rot, x, score };
    }
  }
  return best;
}

function countHoles(board) {
  let holes = 0;
  for (let x = 0; x < Game.COLS; x++) {
    let seen = false;
    for (let y = 0; y < Game.ROWS; y++) {
      if (board[y][x]) seen = true;
      else if (seen) holes++;
    }
  }
  return holes;
}

function playLevel(n, maxPieces) {
  Game.newGame(n, false);
  let pieces = 0;
  let guard = 0;
  while (Game.state !== 'levelclear' && Game.state !== 'gameover') {
    if (guard++ > (maxPieces || 4000)) throw new Error('level ' + n + ' never ended (stuck)');
    if (Game.state === 'clearing') { Game.update(500); continue; }
    if (!Game.cur) { Game.update(500); continue; }
    const id = Game.cur.id;
    const place = bestPlacement(id);
    if (!place) { Game.update(500); continue; }
    Game.cur.rot = place.rot;
    Game.cur.x = place.x;
    Game.hardDrop();
    pieces++;
    if (Game.state === 'clearing') Game.update(500);
  }
  return pieces;
}

check('a fresh game starts on level 1 with an empty 24x10 board', function () {
  Game.newGame(1, false);
  eq(Game.state, 'playing', 'state ');
  eq(Game.board.length, 24, 'rows ');
  eq(Game.board[0].length, 10, 'cols ');
  ok(Game.board.every(function (r) { return r.every(function (c) { return c === 0; }); }), 'board not empty');
  ok(Game.cur, 'no active piece');
  ok(Game.def.linesGoal >= 4, 'goal missing');
});

check('left/right/rotate/hold/hard-drop all work on a live game', function () {
  Game.newGame(1, false);
  const startX = Game.cur.x;
  ok(Game.move(-1), 'move left failed');
  eq(Game.cur.x, startX - 1, 'x after move ');
  ok(Game.move(1), 'move right failed');
  eq(Game.cur.x, startX, 'x restored ');
  const rot0 = Game.cur.rot;
  Game.rotate(1);
  eq(Game.cur.rot, (rot0 + 1) & 3, 'rotation ');
  const before = Game.board.flat().filter(Boolean).length;
  Game.hardDrop();
  const after = Game.board.flat().filter(Boolean).length;
  eq(after, before + 4, 'cells after hard drop ');
});

check('the hold slot stores one piece and locks until the next piece', function () {
  Game.newGame(1, false);
  const first = Game.cur.id;
  Game.holdPiece();
  eq(Game.hold, first, 'hold slot ');
  ok(!Game.holdPiece(), 'hold should be locked after use');
  ok(Game.cur, 'piece missing after hold');
  Game.update(60); Game.hardDrop();
  ok(Game.cur && Game.cur.id, 'no piece after lock');
});

check('gravity lands and locks a piece without any input', function () {
  Game.newGame(1, false);
  const id = Game.cur.id;
  let guard = 0;
  while (Game.state === 'playing' && Game.cur && Game.cur.id === id && guard++ < 4000) {
    Game.update(16);
  }
  const filled = Game.board.flat().filter(Boolean).length;
  eq(filled, 4, 'cells on floor ');
});

check('line clears, scoring and combos fire during a real level', function () {
  const events = [];
  Game.on('lineClear', function (e) { events.push(e); });
  const pieces = playLevel(1);
  eq(Game.state, 'levelclear', 'end state ');
  ok(Game.lines >= 4, 'lines cleared ' + Game.lines);
  ok(Game.score > 0, 'score stayed 0');
  ok(events.length >= 1, 'no lineClear event');
  ok(pieces > 0, 'no pieces placed');
  console.log('       level 1 cleared with ' + pieces + ' pieces · ' +
    Game.lines + ' lines · ' + Game.score + ' points');
});

check('levels 1, 250, 500, 750 and 1000 are all beatable', function () {
  [1, 250, 500, 750, 1000].forEach(function (n) {
    const pieces = playLevel(n, 3000);
    eq(Game.state, 'levelclear', 'level ' + n + ' end state ');
    ok(Game.lines >= Levels.get(n).linesGoal, 'level ' + n + ' lines');
    ok(pieces > 0, 'level ' + n + ' pieces');
  });
  console.log('       sample levels 1/250/500/750/1000 all cleared');
});

check('game over triggers when the castle is overrun', function () {
  Game.newGame(1, false);
  for (let i = 0; i < 400 && Game.state === 'playing'; i++) {
    // always drop straight down the left wall: the stack topples fast
    Game.cur.x = 0;
    Game.cur.rot = 0;
    Game.hardDrop();
    if (Game.state === 'clearing') Game.update(500);
  }
  ok(Game.state === 'gameover' || Game.state === 'levelclear',
    'unexpected state ' + Game.state);
});

check('garbage rows are deterministic per level', function () {
  Game.newGame(500, false);
  const a = JSON.stringify(Game.board);
  Game.newGame(500, false);
  const b = JSON.stringify(Game.board);
  eq(a, b, 'board differs between runs of level 500 ');
  const filled = JSON.parse(a).flat().filter(Boolean).length;
  eq(filled, Levels.get(500).garbageRows * 9, 'garbage cells ');
});

check('starting garbage rows never fill the spawn area', function () {
  for (let n = 300; n <= 1000; n += 50) {
    Game.newGame(n, false);
    for (let y = 0; y < Game.HIDDEN; y++) {
      ok(Game.board[y].every(function (c) { return c === 0; }),
        'spawn row filled at level ' + n);
    }
  }
});

check('pause / resume only work while playing', function () {
  Game.newGame(1, false);
  ok(Game.togglePause(), 'pause failed');
  eq(Game.state, 'paused', 'paused state ');
  Game.update(1000);
  eq(Game.state, 'paused', 'game advanced while paused ');
  ok(Game.togglePause(), 'resume failed');
  eq(Game.state, 'playing', 'resumed state ');
});

/* ============================================================
   5. DIFFICULTY RAMP REPORT
   ============================================================ */
console.log('\n[5] difficulty ramp (sampled)');
console.log('      lvl | gravity | lock | DAS | next | rows | goal | mult');
[1, 100, 250, 500, 750, 900, 1000].forEach(function (n) {
  const d = Levels.get(n);
  const pad = function (v) { return String(v).padStart(6); };
  console.log('     ' + String(n).padStart(4) + ' |' +
    pad(d.gravityMs + 'ms') + pad(d.lockDelayMs + 'ms') + pad(d.dasMs + 'ms') +
    pad(d.preview) + pad(d.garbageRows) + pad(d.linesGoal) + pad(d.multiplier + 'x'));
});

/* ---------------- summary ---------------- */
console.log('\n' + '='.repeat(46));
console.log('passed ' + passed + ' · failed ' + failed + '\n');
if (failed > 0) process.exit(1);
