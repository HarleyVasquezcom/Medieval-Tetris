/* ============================================================
   Game engine — board, pieces, gravity, lock delay, scoring,
   garbage, combos, T-spins and the 1000-level progression.
   Pure logic: no DOM access (render.js and main.js sit on top).
   ============================================================ */
(function (global) {
  'use strict';

  const P = global.MT_Pieces;
  const L = global.MT_Levels;
  const R = global.MT_RNG;

  const COLS = 10;
  const ROWS = 24;      // 4 hidden spawn rows + 20 visible
  const HIDDEN = 4;
  const VIS = ROWS - HIDDEN;

  const BASE_SCORE = { 1: 100, 2: 300, 3: 500, 4: 800 };
  const TSPIN_SCORE = { 1: 400, 2: 1200, 3: 1600 };
  const MINI_SCORE = { 1: 100, 2: 400, 3: 400 };

  const Game = {
    COLS: COLS, ROWS: ROWS, HIDDEN: HIDDEN, VIS: VIS,

    state: 'menu',            // menu | playing | paused | clearing | levelclear | gameover
    levelN: 1,
    def: null,

    board: [],
    cur: null,                // {id, rot, x, y}
    queue: [],
    hold: null,
    holdUsed: false,

    rng: null,
    score: 0, levelScore: 0, lines: 0,
    combo: -1, b2b: false,
    piecesPlaced: 0, tetrises: 0, tspins: 0, clears: 0,

    gravityAcc: 0,
    lockTimer: 0, grounded: false, lockResetsUsed: 0,
    lastAction: 'drop',
    canHold: true,

    clearing: [], clearTimer: 0,
    garbageAcc: 0,
    particles: [], shake: 0,
    stats: { startTime: 0 },

    _ev: {}
  };

  /* ---------------- tiny event emitter ---------------- */
  Game.on = function (name, fn) { (this._ev[name] = this._ev[name] || []).push(fn); };
  Game.emit = function (name, payload) {
    const list = this._ev[name];
    if (list) list.forEach(function (fn) { try { fn(payload); } catch (e) { console.error(e); } });
  };

  /* ---------------- helpers ---------------- */
  function emptyBoard() {
    const b = [];
    for (let y = 0; y < ROWS; y++) b.push(new Array(COLS).fill(0));
    return b;
  }

  // the board exists even before the first level starts (menu preview)
  Game.board = emptyBoard();

  Game.cellsOf = function (piece, rot) {
    return P.cells(piece.id, (rot == null ? piece.rot : rot) & 3).map(function (c) {
      return [piece.x + c[0], piece.y + c[1]];
    });
  };

  Game.collides = function (piece, x, y, rot) {
    const ox = (x == null ? piece.x : x);
    const oy = (y == null ? piece.y : y);
    const cells = P.cells(piece.id, (rot == null ? piece.rot : rot) & 3);
    for (let i = 0; i < cells.length; i++) {
      const cx = ox + cells[i][0];
      const cy = oy + cells[i][1];
      if (cx < 0 || cx >= COLS || cy >= ROWS) return true;
      if (cy < 0) return true;
      if (this.board[cy][cx]) return true;
    }
    return false;
  };

  /* ---------------- level setup ---------------- */
  Game.newGame = function (levelN, keepScore) {
    this.levelN = Math.max(1, Math.min(L.TOTAL, levelN || 1));
    this.def = L.get(this.levelN);
    this.board = emptyBoard();
    this.queue = [];
    this.hold = null;
    this.holdUsed = false;
    this.cur = null;
    this.lines = 0;
    this.levelScore = 0;
    this.combo = -1;
    this.b2b = false;
    this.gravityAcc = 0;
    this.lockTimer = 0;
    this.grounded = false;
    this.lockResetsUsed = 0;
    this.clearing = [];
    this.clearTimer = 0;
    this.garbageAcc = 0;
    this.particles = [];
    this.shake = 0;
    this.canHold = true;
    this.tetrises = 0;
    this.tspins = 0;
    this.clears = 0;
    this.piecesPlaced = 0;
    if (!keepScore) this.score = 0;
    this.stats.startTime = Date.now();

    // deterministic RNG seeded by the level number
    this.rng = R.mulberry32(this.def.seed);

    // starting garbage rows (deterministic per level)
    for (let i = 0; i < this.def.garbageRows; i++) this.addGarbageRow(true);

    this.state = 'playing';
    this.spawn();
    this.emit('levelStart', this.def);
    return this.def;
  };

  Game.restartLevel = function () { return this.newGame(this.levelN, false); };

  /* ---------------- bag / queue ---------------- */
  Game.refillQueue = function () {
    const ids = this.def.pool === '5'
      ? ['I', 'J', 'L', 'O', 'T']
      : P.IDS.slice();
    while (this.queue.length <= Math.max(6, this.def.preview + 2)) {
      const bag = R.shuffle(this.rng, ids.slice());
      for (let i = 0; i < bag.length; i++) this.queue.push(bag[i]);
    }
  };

  Game.peek = function (count) {
    this.refillQueue();
    return this.queue.slice(0, count || this.def.preview);
  };

  Game.spawn = function (idOverride) {
    this.refillQueue();
    let id;
    if (idOverride) { id = idOverride; }
    else { id = this.queue.shift(); this.refillQueue(); }

    const b = P.bounds(id, 0);
    const piece = {
      id: id,
      rot: 0,
      x: Math.floor((COLS - P.STATES[id][0].length) / 2),
      y: HIDDEN - b.minY
    };

    if (this.collides(piece)) { this.gameOver(); return false; }

    this.cur = piece;
    this.gravityAcc = 0;
    this.lockTimer = 0;
    this.grounded = false;
    this.lockResetsUsed = 0;
    this.canHold = true;
    this.lastAction = 'spawn';
    return true;
  };

  /* ---------------- input actions ---------------- */
  Game.move = function (dx) {
    if (this.state !== 'playing' || !this.cur) return false;
    const p = this.cur;
    if (this.collides(p, p.x + dx, p.y, p.rot)) return false;
    p.x += dx;
    this.lastAction = 'move';
    this.refreshLock();
    global.MT_Audio && global.MT_Audio.play('move');
    return true;
  };

  Game.rotate = function (dir) {
    if (this.state !== 'playing' || !this.cur) return false;
    const p = this.cur;
    const from = p.rot & 3;
    const to = (from + (dir > 0 ? 1 : 3)) & 3;
    const kicks = P.kicks(p.id, from, to);
    for (let i = 0; i < kicks.length; i++) {
      const nx = p.x + kicks[i][0];
      const ny = p.y + kicks[i][1];
      if (!this.collides(p, nx, ny, to)) {
        p.x = nx; p.y = ny; p.rot = to;
        this.lastAction = 'rotate';
        this.refreshLock();
        global.MT_Audio && global.MT_Audio.play('rotate');
        return true;
      }
    }
    return false;
  };

  Game.refreshLock = function () {
    if (!this.grounded) { this.lockTimer = 0; return; }
    if (this.lockResetsUsed < this.def.lockResets) {
      this.lockTimer = 0;
      this.lockResetsUsed++;
    }
  };

  Game.softDrop = function () {
    if (this.state !== 'playing' || !this.cur) return false;
    const p = this.cur;
    if (this.collides(p, p.x, p.y + 1, p.rot)) return false;
    p.y++;
    this.score += 1;
    this.gravityAcc = 0;
    this.lastAction = 'soft';
    this.grounded = false;
    this.lockTimer = 0;
    return true;
  };

  Game.hardDrop = function () {
    if (this.state !== 'playing' || !this.cur) return false;
    const p = this.cur;
    let dist = 0;
    while (!this.collides(p, p.x, p.y + 1, p.rot)) { p.y++; dist++; }
    this.score += dist * 2;
    this.lastAction = 'hard';
    this.spawnDust(p);
    this.shake = 6;
    global.MT_Audio && global.MT_Audio.play('drop');
    this.lockPiece();
    return true;
  };

  Game.holdPiece = function () {
    if (this.state !== 'playing' || !this.cur || !this.canHold) return false;
    const outgoing = this.cur.id;
    const incoming = this.hold;
    this.hold = outgoing;
    this.holdUsed = true;
    this.canHold = false;
    if (incoming) this.spawn(incoming);
    else { this.queue.shift(); this.spawn(); this.refillQueue(); }
    this.holdUsed = true;
    this.canHold = false;
    global.MT_Audio && global.MT_Audio.play('hold');
    this.emit('hold');
    return true;
  };

  /* ---------------- gravity & locking ---------------- */
  Game.stepGravity = function (dt) {
    const p = this.cur;
    if (!p) return;
    const g = this.def.gravityMs;
    this.gravityAcc += dt;
    let guard = 0;
    while (this.gravityAcc >= g && guard++ < 40) {
      this.gravityAcc -= g;
      if (!this.collides(p, p.x, p.y + 1, p.rot)) {
        p.y++;
        this.lastAction = 'gravity';
        if (this.grounded) { this.grounded = false; this.lockTimer = 0; }
      } else break;
    }

    const isGrounded = this.collides(p, p.x, p.y + 1, p.rot);
    if (isGrounded) {
      if (!this.grounded) { this.grounded = true; this.lockTimer = 0; }
      this.lockTimer += dt;
      if (this.lockTimer >= this.def.lockDelayMs) this.lockPiece();
    } else {
      this.grounded = false;
      this.lockTimer = 0;
    }
  };

  Game.detectTSpin = function () {
    const p = this.cur;
    if (!p || p.id !== 'T' || this.lastAction !== 'rotate') return 0;
    const cx = p.x + 1, cy = p.y + 1; // centre of the 3x3 matrix
    const self = this;
    function occupied(x, y) {
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y < 0) return false;
      return !!self.board[y][x];
    }
    const corners = {
      TL: occupied(cx - 1, cy - 1),
      TR: occupied(cx + 1, cy - 1),
      BL: occupied(cx - 1, cy + 1),
      BR: occupied(cx + 1, cy + 1)
    };
    const total = (corners.TL ? 1 : 0) + (corners.TR ? 1 : 0) +
                  (corners.BL ? 1 : 0) + (corners.BR ? 1 : 0);
    if (total < 3) return 0;
    const front = [{ 0: ['TL','TR'], 1: ['TR','BR'], 2: ['BL','BR'], 3: ['TL','BL'] }[p.rot & 3]];
    const full = corners[front[0]] && corners[front[1]];
    return full ? 2 : 1; // 2 = full T-spin, 1 = mini
  };

  Game.lockPiece = function () {
    const p = this.cur;
    if (!p) return;
    const tspin = this.detectTSpin();
    const value = P.colorIndex[p.id];

    this.cellsOf(p).forEach(function (c) {
      if (c[1] >= 0 && c[1] < ROWS && c[0] >= 0 && c[0] < COLS) {
        this.board[c[1]][c[0]] = value;
      }
    }, this);

    this.piecesPlaced++;
    this.cur = null;
    this.grounded = false;
    this.lockTimer = 0;
    global.MT_Audio && global.MT_Audio.play('lock');

    // full rows
    const rows = [];
    for (let y = 0; y < ROWS; y++) {
      let full = true;
      for (let x = 0; x < COLS; x++) if (!this.board[y][x]) { full = false; break; }
      if (full) rows.push(y);
    }

    const n = rows.length;
    if (tspin) this.tspins++;
    this.applyScoring(n, tspin);

    if (n > 0) {
      this.clearing = rows;
      this.clearTimer = 340;
      this.state = 'clearing';
      this.clearBurst(rows);
      this.emit('lineClear', { rows: rows, lines: n, tspin: tspin, combo: this.combo });
    } else {
      if (tspin) {
        this.emit('callout', { key: 'clearTspin', tspin: true });
        global.MT_Audio && global.MT_Audio.play('tspin');
      }
      this.emit('lock');
      this.afterRowChange();
      if (this.state === 'playing') this.spawn();
    }
  };

  Game.applyScoring = function (n, tspin) {
    if (n === 0) {
      this.combo = -1;
      return;
    }
    this.combo++;
    this.clears++;

    let base;
    if (tspin === 2) base = TSPIN_SCORE[n] || 400;
    else if (tspin === 1) base = MINI_SCORE[n] || 100;
    else base = BASE_SCORE[n] || 0;

    const isPower = n >= 4 || tspin > 0;
    let b2b = false;
    if (isPower && this.b2b) { b2b = true; }
    if (isPower) this.b2b = true; else if (n > 0) this.b2b = false;
    if (n === 4) this.tetrises++;

    const comboBonus = this.combo > 0 ? 50 * this.combo : 0;
    let total = (base + comboBonus) * this.def.multiplier;
    if (b2b) total *= 1.5;
    total = Math.round(total);
    this.score += total;
    this.levelScore += total;
    this.lines += n;

    this.emit('score', {
      lines: n, tspin: tspin, combo: this.combo, b2b: b2b, points: total
    });
  };

  /** Called after rows change: check victory and cleanup. */
  Game.afterRowChange = function () {
    if (this.lines >= this.def.linesGoal) this.levelClear();
  };

  Game.finishClear = function () {
    const rows = this.clearing;
    this.clearing = [];
    this.clearTimer = 0;
    rows.sort(function (a, b) { return a - b; });
    for (let i = rows.length - 1; i >= 0; i--) {
      const y = rows[i];
      for (let yy = y; yy > 0; yy--) this.board[yy] = this.board[yy - 1].slice();
      this.board[0] = new Array(COLS).fill(0);
    }
    this.state = 'playing';
    this.afterRowChange();
    if (this.state === 'playing') this.spawn();
  };

  /* ---------------- garbage ---------------- */
  Game.addGarbageRow = function (silent) {
    const self = this;
    // if the top row has content, the attack is lethal
    const top = this.board[0];
    for (let x = 0; x < COLS; x++) if (top[x]) { this.gameOver(); return; }
    for (let y = 0; y < ROWS - 1; y++) this.board[y] = this.board[y + 1].slice();
    const hole = Math.floor(this.rng() * COLS);
    const row = new Array(COLS).fill(8); // 8 = stone/garbage cell
    row[hole] = 0;
    this.board[ROWS - 1] = row;
    // keep the active piece from being squashed illegally
    if (this.cur && this.collides(this.cur)) {
      if (this.collides(this.cur, this.cur.x, this.cur.y - 1, this.cur.rot)) {
        this.gameOver(); return;
      } else this.cur.y--;
    }
    if (!silent) {
      this.shake = 5;
      global.MT_Audio && global.MT_Audio.play('garbage');
      this.emit('garbage');
    }
  };

  Game.stepGarbage = function (dt) {
    const every = this.def.garbageEveryMs;
    if (!every || this.state !== 'playing') return;
    this.garbageAcc += dt;
    if (this.garbageAcc >= every) {
      this.garbageAcc = 0;
      this.addGarbageRow(false);
    }
  };

  /* ---------------- end states ---------------- */
  Game.levelClear = function () {
    if (this.state === 'levelclear') return;
    this.state = 'levelclear';
    this.burstBoard();
    global.MT_Audio && global.MT_Audio.play('levelup');
    this.emit('levelClear', {
      level: this.levelN, score: this.score, lines: this.lines,
      points: this.levelScore
    });
  };

  Game.gameOver = function () {
    if (this.state === 'gameover') return;
    this.state = 'gameover';
    this.cur = null;
    this.shake = 14;
    global.MT_Audio && global.MT_Audio.play('gameover');
    this.emit('gameOver', { level: this.levelN, score: this.score });
  };

  Game.togglePause = function () {
    if (this.state === 'playing') { this.state = 'paused'; this.emit('pause'); return true; }
    if (this.state === 'paused') { this.state = 'playing'; this.emit('resume'); return true; }
    return false;
  };

  /* ---------------- effects ---------------- */
  Game.spawnDust = function (piece) {
    const cells = this.cellsOf(piece);
    for (let i = 0; i < cells.length; i++) {
      for (let k = 0; k < 3; k++) {
        this.particles.push({
          x: cells[i][0] + 0.5, y: cells[i][1] + 1,
          vx: (Math.random() - 0.5) * 0.06,
          vy: -Math.random() * 0.05,
          life: 400, max: 400, size: 0.16, color: '#c9a86a'
        });
      }
    }
  };

  Game.clearBurst = function (rows) {
    const pal = P.PALETTE;
    for (let i = 0; i < rows.length; i++) {
      for (let x = 0; x < COLS; x++) {
        const v = this.board[rows[i]][x];
        const col = pal[v] ? pal[v].light : '#ffd97a';
        for (let k = 0; k < 2; k++) {
          this.particles.push({
            x: x + 0.5, y: rows[i] + 0.5,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.7) * 0.2,
            life: 700, max: 700, size: 0.2, color: col
          });
        }
      }
    }
    this.shake = 7;
  };

  Game.burstBoard = function () {
    for (let y = HIDDEN; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!this.board[y][x]) continue;
        this.particles.push({
          x: x + 0.5, y: y + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.35,
          life: 1100, max: 1100, size: 0.26, color: '#ffd97a'
        });
      }
    }
    this.shake = 10;
  };

  Game.stepEffects = function (dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) { this.particles.splice(i, 1); continue; }
      p.x += p.vx * dt / 16;
      p.y += p.vy * dt / 16;
      p.vy += 0.0016 * dt;
    }
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 0.03);
  };

  /* ---------------- main tick ---------------- */
  Game.update = function (dt) {
    if (dt > 100) dt = 100; // tab was hidden / long frame
    this.stepEffects(dt);

    if (this.state === 'clearing') {
      this.clearTimer -= dt;
      if (this.clearTimer <= 0) this.finishClear();
      return;
    }
    if (this.state !== 'playing') return;

    this.stepGarbage(dt);
    if (this.state === 'playing' && this.cur) this.stepGravity(dt);
  };

  global.MT_Game = Game;
})(typeof window !== 'undefined' ? window : globalThis);
