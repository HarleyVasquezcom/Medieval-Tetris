/* ============================================================
   Renderer — canvas painter for the board, the pieces, the
   previews and the animated medieval backdrop.
   Blocks are pre-rendered into sprites for speed.
   ============================================================ */
(function (global) {
  'use strict';

  const P = global.MT_Pieces;
  const L = global.MT_Levels;
  const HIDDEN = 4;

  const R = {
    board: null, bctx: null,
    bg: null, bgctx: null,
    cell: 26,
    sprites: {},
    spriteCell: 0,
    sceneCache: null,
    sceneKey: '',
    sceneW: 0, sceneH: 0,
    sparks: []
  };

  /* ---------------- sizing ---------------- */
  R.resize = function () {
    const boardCanvas = document.getElementById('board');
    const bgCanvas = document.getElementById('bg');
    if (!boardCanvas) return;

    const mobile = window.innerWidth <= 760;
    const maxW = mobile
      ? Math.min(window.innerWidth - 44, 460)
      : Math.min(window.innerWidth * 0.34, 440);
    const maxH = mobile
      ? window.innerHeight * 0.52
      : window.innerHeight * 0.76;

    let cell = Math.floor(Math.min(maxW / 10, maxH / 20));
    cell = Math.max(14, Math.min(38, cell));
    R.cell = cell;

    boardCanvas.width = 10 * cell;
    boardCanvas.height = 20 * cell;
    boardCanvas.style.width = (10 * cell) + 'px';
    boardCanvas.style.height = (20 * cell) + 'px';
    R.board = boardCanvas;
    R.bctx = boardCanvas.getContext('2d', { willReadFrequently: true });

    if (bgCanvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      bgCanvas.width = Math.floor(window.innerWidth * dpr);
      bgCanvas.height = Math.floor(window.innerHeight * dpr);
      R.bg = bgCanvas;
      R.bgctx = bgCanvas.getContext('2d');
      R.bgctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R.sceneKey = ''; // force backdrop rebuild
    }
    R.buildSprites(cell);
    R.buildBoardTexture();
  };

  /* ---------------- block sprites ---------------- */
  R.buildSprites = function (cell) {
    if (R.spriteCell === cell) return;
    R.spriteCell = cell;
    R.sprites = {};
    P.PALETTE.forEach(function (c, i) {
      if (!c) return;
      R.sprites[i] = makeSprite(cell, c.base, c.light, c.dark);
    });
    R.sprites[8] = makeSprite(cell, '#6b6b74', '#a9a9b4', '#33333a'); // garbage stone
  };

  function makeSprite(cell, base, light, dark) {
    const c = document.createElement('canvas');
    c.width = cell; c.height = cell;
    const x = c.getContext('2d');
    const r = Math.max(2, Math.round(cell * 0.14));
    const pad = Math.max(1, Math.round(cell * 0.045));

    // body
    roundRect(x, pad, pad, cell - pad * 2, cell - pad * 2, r);
    const grad = x.createLinearGradient(0, 0, 0, cell);
    grad.addColorStop(0, light);
    grad.addColorStop(0.42, base);
    grad.addColorStop(1, dark);
    x.fillStyle = grad;
    x.fill();

    // bevel: light top-left, dark bottom-right
    x.save();
    roundRect(x, pad, pad, cell - pad * 2, cell - pad * 2, r);
    x.clip();
    x.strokeStyle = 'rgba(255,255,255,.55)';
    x.lineWidth = Math.max(1.5, cell * 0.09);
    x.beginPath();
    x.moveTo(pad, cell * 0.30); x.lineTo(cell * 0.30, pad);
    x.stroke();
    x.strokeStyle = 'rgba(0,0,0,.42)';
    x.beginPath();
    x.moveTo(cell - pad, cell * 0.72); x.lineTo(cell * 0.72, cell - pad);
    x.stroke();

    // gem highlight
    x.globalAlpha = 0.75;
    x.fillStyle = 'rgba(255,255,255,.9)';
    x.beginPath();
    x.ellipse(cell * 0.34, cell * 0.3, cell * 0.13, cell * 0.09, -0.5, 0, Math.PI * 2);
    x.fill();
    x.restore();

    // outline
    roundRect(x, pad + 0.5, pad + 0.5, cell - pad * 2 - 1, cell - pad * 2 - 1, r);
    x.strokeStyle = 'rgba(0,0,0,.55)';
    x.lineWidth = 1;
    x.stroke();
    return c;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ---------------- board texture (cached) ---------------- */
  R.buildBoardTexture = function () {
    const ctx = R.bctx;
    if (!ctx) return;
    const w = R.board.width, h = R.board.height, cell = R.cell;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#15100a');
    g.addColorStop(1, '#0b0805');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // stone bricks
    ctx.strokeStyle = 'rgba(255,255,255,.035)';
    ctx.lineWidth = 1;
    for (let y = 0; y <= 20; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell + 0.5); ctx.lineTo(w, y * cell + 0.5);
      ctx.stroke();
    }
    for (let y = 0; y < 20; y++) {
      const offset = (y % 2) * cell * 0.5;
      for (let x = 0; x <= 10; x++) {
        const px = x * cell + offset;
        ctx.beginPath();
        ctx.moveTo(px + 0.5, y * cell); ctx.lineTo(px + 0.5, (y + 1) * cell);
        ctx.stroke();
      }
    }
    R.texture = ctx.getImageData(0, 0, w, h);
  };

  /* ---------------- piece preview ---------------- */
  R.drawPiece = function (canvas, id, opts) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!id) return;
    const cells = P.cells(id, 0);
    const b = P.bounds(id, 0);
    const size = (opts && opts.cell) || Math.min(w / (b.w + 1), h / (b.h + 1));
    const ox = (w - b.w * size) / 2 - b.minX * size;
    const oy = (h - b.h * size) / 2 - b.minY * size;
    const sprite = R.sprites[P.colorIndex[id]];
    cells.forEach(function (c) {
      const x = Math.round(ox + c[0] * size);
      const y = Math.round(oy + c[1] * size);
      if (sprite && Math.abs(size - R.spriteCell) < 0.5) {
        ctx.drawImage(sprite, x, y);
      } else {
        const col = P.PALETTE[P.colorIndex[id]];
        ctx.fillStyle = col.base;
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
        ctx.fillStyle = col.light;
        ctx.fillRect(x + 1, y + 1, size - 2, Math.max(2, size * 0.22));
      }
    });
  };

  /* ---------------- board frame ---------------- */
  R.draw = function (game, time) {
    const ctx = R.bctx;
    if (!ctx) return;
    const cell = R.cell;
    const w = R.board.width, h = R.board.height;

    ctx.save();
    if (game.shake > 0) {
      ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
    }

    // texture
    if (R.texture) ctx.putImageData(R.texture, 0, 0);
    else { ctx.fillStyle = '#0d0a06'; ctx.fillRect(0, 0, w, h); }

    const clearSet = {};
    const flash = game.state === 'clearing' ? (Math.sin(game.clearTimer / 26) + 1) / 2 : 0;
    game.clearing.forEach(function (y) { clearSet[y] = true; });

    // settled cells
    for (let y = HIDDEN; y < game.ROWS; y++) {
      const row = game.board[y];
      if (!row) continue;
      for (let x = 0; x < game.COLS; x++) {
        const v = row[x];
        if (!v) continue;
        const sprite = R.sprites[v] || R.sprites[8];
        const px = x * cell, py = (y - HIDDEN) * cell;
        if (clearSet[y]) {
          ctx.globalAlpha = 1;
          ctx.drawImage(sprite, px, py);
          ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + flash * 0.55) + ')';
          ctx.fillRect(px, py, cell, cell);
        } else {
          ctx.drawImage(sprite, px, py);
        }
      }
    }

    if (game.cur && game.def) {
      const p = game.cur;

      // ghost
      if (game.def.ghost && game.state === 'playing') {
        let gy = p.y;
        while (!game.collides(p, p.x, gy + 1, p.rot)) gy++;
        ctx.globalAlpha = 0.55;
        P.cells(p.id, p.rot & 3).forEach(function (c) {
          const x = p.x + c[0], y = gy + c[1];
          if (y < HIDDEN) return;
          ctx.strokeStyle = P.PALETTE[P.colorIndex[p.id]].light;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          roundRect(ctx, x * cell + 3, (y - HIDDEN) * cell + 3, cell - 6, cell - 6, 3);
          ctx.stroke();
          ctx.setLineDash([]);
        });
        ctx.globalAlpha = 1;
      }

      // active piece
      const sprite = R.sprites[P.colorIndex[p.id]];
      const lockPulse = game.grounded
        ? 1 - Math.max(0, 1 - game.lockTimer / game.def.lockDelayMs) * 0.18
        : 1;
      ctx.globalAlpha = 1;
      P.cells(p.id, p.rot & 3).forEach(function (c) {
        const x = p.x + c[0], y = p.y + c[1];
        if (y < HIDDEN) return;
        const px = x * cell, py = (y - HIDDEN) * cell;
        ctx.save();
        if (lockPulse < 1) {
          ctx.translate(px + cell / 2, py + cell / 2);
          ctx.scale(lockPulse, lockPulse);
          ctx.translate(-px - cell / 2, -py - cell / 2);
        }
        ctx.drawImage(sprite, px, py);
        ctx.restore();
      });

      // red danger tint when the stack reaches the top rows
      const topRow = highestRow(game);
      if (topRow >= 0 && topRow - HIDDEN <= 3) {
        const a = 0.10 + 0.10 * (Math.sin(time / 220) + 1);
        ctx.fillStyle = 'rgba(200,40,40,' + a.toFixed(3) + ')';
        ctx.fillRect(0, 0, w, h * 0.22);
      }
    }

    // particles
    for (let i = 0; i < game.particles.length; i++) {
      const pt = game.particles[i];
      if (pt.y < HIDDEN) continue;
      const a = Math.max(0, pt.life / pt.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = pt.color;
      const s = pt.size * cell;
      ctx.fillRect((pt.x * cell) - s / 2, ((pt.y - HIDDEN) * cell) - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    // vignette
    const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.45)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  };

  function highestRow(game) {
    for (let y = 0; y < game.ROWS; y++) {
      for (let x = 0; x < game.COLS; x++) if (game.board[y][x]) return y;
    }
    return -1;
  }

  /* ============================================================
     BACKDROP — 6 procedural medieval scenes, cached + animated
     ============================================================ */
  R.drawBackground = function (def, time) {
    const ctx = R.bgctx;
    if (!ctx) return;
    const w = window.innerWidth, h = window.innerHeight;
    const hue = def ? def.hue : 24;
    const scene = def ? def.scene : 0;

    const key = [scene, hue, Math.round(w / 8), Math.round(h / 8)].join('|');
    if (key !== R.sceneKey || !R.sceneCache) {
      R.sceneKey = key;
      R.sceneCache = buildScene(scene, hue, w, h);
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(R.sceneCache, 0, 0, w, h);

    // drifting particles: embers, snow, fireflies or rain by scene
    const kind = ['ember', 'snow', 'mist', 'ember', 'firefly', 'ash'][scene];
    const count = kind === 'mist' ? 0 : 46;
    const t = time / 1000;
    for (let i = 0; i < count; i++) {
      const seed = i * 97.13;
      let x = ((seed * 13.7) % 100) / 100 * w;
      let y;
      let alpha = 0.5;
      let size = 2;
      if (kind === 'snow') {
        y = ((t * 18 + seed * 7) % 1) * h;
        x += Math.sin(t * 0.6 + i) * 26;
        alpha = 0.35 + ((i % 5) / 10);
        size = 1.4 + (i % 3);
      } else if (kind === 'ember') {
        y = h - ((t * 26 + seed * 11) % 1) * h;
        x += Math.sin(t + i) * 20;
        alpha = 0.55 - (y / h) * 0.4;
        size = 1.5 + (i % 3) * 0.8;
      } else if (kind === 'firefly') {
        y = h * 0.35 + Math.sin(t * 0.8 + i) * h * 0.22;
        x += Math.cos(t * 0.5 + i * 2) * 40;
        alpha = 0.3 + 0.45 * (Math.sin(t * 2 + i) + 1) / 2;
        size = 2;
      } else { // ash
        y = ((t * 12 + seed * 5) % 1) * h;
        x += Math.sin(t * 0.4 + i) * 30;
        alpha = 0.3;
        size = 1.6;
      }
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = kind === 'snow' ? '#eaf4ff' : (kind === 'firefly' ? '#ffe98a' : '#ffb35c');
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // torch flicker vignette
    const flick = 0.06 + 0.05 * (Math.sin(t * 7.3) + Math.sin(t * 3.1)) / 2;
    const vg = ctx.createRadialGradient(w / 2, h * 0.42, Math.min(w, h) * 0.2, w / 2, h * 0.5, Math.max(w, h) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,' + (0.62 - flick).toFixed(3) + ')');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  };

  function buildScene(scene, hue, w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');

    // sky
    const sky = x.createLinearGradient(0, 0, 0, h);
    if (scene === 3 || scene === 5) {
      sky.addColorStop(0, 'hsl(' + hue + ',45%,12%)');
      sky.addColorStop(1, 'hsl(' + ((hue + 30) % 360) + ',55%,20%)');
    } else {
      sky.addColorStop(0, 'hsl(' + hue + ',52%,20%)');
      sky.addColorStop(0.55, 'hsl(' + ((hue + 18) % 360) + ',48%,32%)');
      sky.addColorStop(1, 'hsl(' + ((hue + 40) % 360) + ',40%,16%)');
    }
    x.fillStyle = sky;
    x.fillRect(0, 0, w, h);

    // stars
    if (scene === 5 || scene === 3) {
      for (let i = 0; i < 90; i++) {
        const sx = ((i * 127.1) % w);
        const sy = ((i * 311.7) % (h * 0.6));
        x.globalAlpha = 0.2 + ((i * 13) % 7) / 12;
        x.fillStyle = '#fff7dd';
        x.fillRect(sx, sy, 1.6, 1.6);
      }
      x.globalAlpha = 1;
    }

    // moon / sun
    const mx = w * 0.78, my = h * 0.2, mr = Math.min(w, h) * 0.07;
    const mg = x.createRadialGradient(mx, my, mr * 0.2, mx, my, mr * 3);
    mg.addColorStop(0, scene === 5 ? 'rgba(230,240,255,.9)' : 'rgba(255,225,160,.95)');
    mg.addColorStop(1, 'rgba(255,200,120,0)');
    x.fillStyle = mg;
    x.beginPath(); x.arc(mx, my, mr * 3, 0, Math.PI * 2); x.fill();
    x.fillStyle = scene === 5 ? '#e8eefb' : '#ffe7b0';
    x.beginPath(); x.arc(mx, my, mr, 0, Math.PI * 2); x.fill();

    // far hills
    x.fillStyle = 'hsla(' + ((hue + 20) % 360) + ',35%,14%,.85)';
    ridge(x, w, h * 0.58, 120, 0.006, 0);
    x.fillStyle = 'hsla(' + ((hue + 10) % 360) + ',32%,10%,.92)';
    ridge(x, w, h * 0.68, 90, 0.009, 7);

    if (scene === 0 || scene === 3) drawCastle(x, w, h, hue);
    else if (scene === 1) drawForest(x, w, h, hue);
    else if (scene === 2) drawMountains(x, w, h, hue);
    else if (scene === 4) drawCathedral(x, w, h, hue);
    else drawVolcano(x, w, h, hue);

    // ground
    const ground = x.createLinearGradient(0, h * 0.82, 0, h);
    ground.addColorStop(0, 'hsla(' + ((hue + 5) % 360) + ',30%,8%,.9)');
    ground.addColorStop(1, '#0a0705');
    x.fillStyle = ground;
    x.fillRect(0, h * 0.84, w, h * 0.16);
    return c;
  }

  function ridge(x, w, base, amp, freq, seed) {
    x.beginPath();
    x.moveTo(0, x.canvas.height);
    for (let px = 0; px <= w; px += 6) {
      const y = base
        - Math.sin(px * freq + seed) * amp * 0.5
        - Math.sin(px * freq * 2.7 + seed * 3) * amp * 0.25;
      x.lineTo(px, y);
    }
    x.lineTo(w, x.canvas.height);
    x.closePath();
    x.fill();
  }

  function battlements(x, cx, top, width, size) {
    for (let bx = cx - width / 2; bx < cx + width / 2; bx += size * 2) {
      x.fillRect(bx, top - size, size, size);
    }
  }

  function drawCastle(x, w, h, hue) {
    const base = h * 0.86;
    const s = Math.min(w, h) / 700;
    x.fillStyle = '#120d09';
    const cx = w * 0.24;
    const tw = 60 * s, th = 190 * s;
    // towers
    [[cx - 70 * s, th], [cx + 70 * s, th * 0.85], [cx, th * 1.25]].forEach(function (t) {
      x.fillRect(t[0] - tw / 2, base - t[1], tw, t[1]);
      x.beginPath();
      x.moveTo(t[0] - tw * 0.7, base - t[1]);
      x.lineTo(t[0], base - t[1] - 55 * s);
      x.lineTo(t[0] + tw * 0.7, base - t[1]);
      x.closePath();
      x.fill();
      battlements(x, t[0], base - t[1], tw, 9 * s);
      // windows
      x.fillStyle = 'rgba(255,190,90,.55)';
      x.fillRect(t[0] - 4 * s, base - t[1] + 30 * s, 8 * s, 16 * s);
      x.fillStyle = '#120d09';
    });
    // walls
    x.fillRect(cx - 130 * s, base - 95 * s, 260 * s, 95 * s);
    battlements(x, cx, base - 95 * s, 260 * s, 14 * s);
    // gate
    x.fillStyle = '#050302';
    x.beginPath();
    x.moveTo(cx - 26 * s, base);
    x.lineTo(cx - 26 * s, base - 40 * s);
    x.arc(cx, base - 40 * s, 26 * s, Math.PI, 0);
    x.lineTo(cx + 26 * s, base);
    x.closePath();
    x.fill();
  }

  function drawForest(x, w, h, hue) {
    const base = h * 0.9;
    for (let i = 0; i < 26; i++) {
      const tx = (i / 26) * w + ((i * 37) % 30);
      const th = 60 + ((i * 53) % 120) * (Math.min(w, h) / 700);
      const tw = th * 0.4;
      x.fillStyle = i % 2 ? '#0d1109' : '#101a0d';
      x.beginPath();
      x.moveTo(tx, base);
      x.lineTo(tx - tw / 2, base);
      x.lineTo(tx, base - th);
      x.lineTo(tx + tw / 2, base);
      x.closePath();
      x.fill();
      x.fillRect(tx - 3, base - 10, 6, 12);
    }
  }

  function drawMountains(x, w, h, hue) {
    const base = h * 0.88;
    for (let i = 0; i < 7; i++) {
      const mx = (i / 7) * w + w * 0.06;
      const mh = h * (0.22 + ((i * 29) % 40) / 160);
      const mw = w * 0.16;
      x.fillStyle = i % 2 ? '#0e1116' : '#141821';
      x.beginPath();
      x.moveTo(mx - mw, base);
      x.lineTo(mx, base - mh);
      x.lineTo(mx + mw, base);
      x.closePath();
      x.fill();
      // snow cap
      x.fillStyle = 'rgba(235,242,255,.75)';
      x.beginPath();
      x.moveTo(mx - mw * 0.18, base - mh * 0.78);
      x.lineTo(mx, base - mh);
      x.lineTo(mx + mw * 0.18, base - mh * 0.78);
      x.lineTo(mx + mw * 0.08, base - mh * 0.82);
      x.lineTo(mx, base - mh * 0.76);
      x.lineTo(mx - mw * 0.08, base - mh * 0.82);
      x.closePath();
      x.fill();
    }
  }

  function drawCathedral(x, w, h, hue) {
    const base = h * 0.87;
    const s = Math.min(w, h) / 700;
    x.fillStyle = '#100c14';
    const cx = w * 0.74;
    x.fillRect(cx - 110 * s, base - 210 * s, 220 * s, 210 * s);
    // twin spires
    [[cx - 70 * s, 300 * s], [cx + 70 * s, 300 * s]].forEach(function (t) {
      x.fillRect(t[0] - 26 * s, base - t[1], 52 * s, t[1]);
      x.beginPath();
      x.moveTo(t[0] - 34 * s, base - t[1]);
      x.lineTo(t[0], base - t[1] - 80 * s);
      x.lineTo(t[0] + 34 * s, base - t[1]);
      x.closePath();
      x.fill();
      x.fillStyle = 'rgba(255,214,120,.5)';
      x.fillRect(t[0] - 6 * s, base - t[1] + 40 * s, 12 * s, 30 * s);
      x.fillStyle = '#100c14';
    });
    // rose window
    x.fillStyle = 'rgba(255,190,90,.45)';
    x.beginPath(); x.arc(cx, base - 150 * s, 26 * s, 0, Math.PI * 2); x.fill();
    // door
    x.fillStyle = '#050306';
    x.beginPath();
    x.moveTo(cx - 30 * s, base);
    x.lineTo(cx - 30 * s, base - 55 * s);
    x.arc(cx, base - 55 * s, 30 * s, Math.PI, 0);
    x.lineTo(cx + 30 * s, base);
    x.closePath();
    x.fill();
  }

  function drawVolcano(x, w, h, hue) {
    const base = h * 0.9;
    const cx = w * 0.2;
    x.fillStyle = '#0d0a0c';
    x.beginPath();
    x.moveTo(cx - w * 0.3, base);
    x.lineTo(cx, base - h * 0.34);
    x.lineTo(cx + w * 0.3, base);
    x.closePath();
    x.fill();
    // lava crack
    const g = x.createLinearGradient(cx, base - h * 0.3, cx, base);
    g.addColorStop(0, 'rgba(255,140,40,.95)');
    g.addColorStop(1, 'rgba(255,60,20,.15)');
    x.strokeStyle = g;
    x.lineWidth = 5;
    x.beginPath();
    x.moveTo(cx, base - h * 0.32);
    x.lineTo(cx + 14, base - h * 0.22);
    x.lineTo(cx - 10, base - h * 0.12);
    x.lineTo(cx + 8, base);
    x.stroke();
    // glow
    const gl = x.createRadialGradient(cx, base - h * 0.33, 4, cx, base - h * 0.33, h * 0.3);
    gl.addColorStop(0, 'rgba(255,150,50,.55)');
    gl.addColorStop(1, 'rgba(255,80,20,0)');
    x.fillStyle = gl;
    x.fillRect(cx - h * 0.3, base - h * 0.6, h * 0.6, h * 0.6);
  }

  global.MT_Render = R;
})(typeof window !== 'undefined' ? window : globalThis);
