/* ============================================================
   Main — UI, input (keyboard + touch), menus, level select,
   HUD, persistence and the render loop.
   ============================================================ */
(function (global) {
  'use strict';

  const Game = global.MT_Game;
  const L = global.MT_Levels;
  const I18n = global.MT_I18n;
  const Render = global.MT_Render;
  const Audio = global.MT_Audio;

  const SETTINGS_KEY = 'mt.settings.v1';
  const PROGRESS_KEY = 'mt.progress.v1';

  const settings = { sound: true, unlockAll: false, ghost: true, pageSize: 50 };
  const progress = { maxLevel: 1, best: 0, scores: {} };

  let view = 'menu';           // menu | levels | howto | settings
  let overlayOpen = true;
  let page = 0;
  let bannerOpen = false;

  /* ---------------- storage ---------------- */
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const v = JSON.parse(raw);
      return v && typeof v === 'object' ? Object.assign(fallback, v) : fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }
  function loadAll() {
    loadJSON(SETTINGS_KEY, settings);
    loadJSON(PROGRESS_KEY, progress);
    if (!progress.scores) progress.scores = {};
  }
  function saveSettings() { saveJSON(SETTINGS_KEY, settings); }
  function saveProgress() { saveJSON(PROGRESS_KEY, progress); }

  function isLocked(n) {
    return !settings.unlockAll && n > progress.maxLevel;
  }

  /* ---------------- helpers ---------------- */
  const $ = function (id) { return document.getElementById(id); };
  function t(key, vars) { return I18n.t(key, vars); }

  let toastTimer = null;
  function toast(msg, ms) {
    const el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 1600);
  }

  /* ---------------- overlay / views ---------------- */
  function openOverlay(next) {
    view = next;
    overlayOpen = true;
    $('overlay-root').classList.remove('hidden');
    ['menu', 'levels', 'howto', 'settings'].forEach(function (v) {
      const el = $('view-' + v);
      if (el) el.classList.toggle('hidden', v !== next);
    });
    if (next === 'levels') renderLevelGrid();
    if (next === 'howto') $('howto-body').innerHTML = t('howto');
    if (next === 'settings') syncSettingsForm();
    if (next === 'menu') updateMenuProgress();
  }

  function closeOverlay() {
    overlayOpen = false;
    $('overlay-root').classList.add('hidden');
  }

  /* ---------------- banner ---------------- */
  function showBanner(title, text, actions) {
    bannerOpen = true;
    $('banner-title').textContent = title;
    $('banner-text').textContent = text || '';
    const box = $('banner-actions');
    box.innerHTML = '';
    (actions || []).forEach(function (a) {
      const b = document.createElement('button');
      b.className = 'btn small' + (a.primary ? ' primary' : '');
      b.textContent = a.label;
      b.addEventListener('click', function () { Audio.play('click'); a.fn(); });
      box.appendChild(b);
    });
    $('banner').classList.remove('hidden');
  }
  function hideBanner() {
    bannerOpen = false;
    $('banner').classList.add('hidden');
  }

  /* ---------------- level select ---------------- */
  function renderLevelGrid() {
    const grid = $('level-grid');
    if (!grid) return;
    const size = settings.pageSize || 50;
    const pages = Math.ceil(L.TOTAL / size);
    page = Math.max(0, Math.min(pages - 1, page));
    $('pg-label').textContent = t('pageOf', { a: page + 1, b: pages });

    const sel = $('pg-size');
    if (sel.options.length === 0) {
      [25, 50, 100].forEach(function (n) {
        const o = document.createElement('option');
        o.value = n; o.textContent = n;
        sel.appendChild(o);
      });
    }
    sel.value = String(size);

    const start = page * size + 1;
    const end = Math.min(L.TOTAL, start + size - 1);
    let html = '';
    for (let n = start; n <= end; n++) {
      const def = L.get(n);
      const locked = isLocked(n);
      const done = n < progress.maxLevel;
      const current = Game.def && Game.def.n === n && Game.state !== 'menu';
      const cls = ['lvl'];
      if (locked) cls.push('locked');
      if (done) cls.push('done');
      if (current) cls.push('current');
      html += '<button class="' + cls.join(' ') + '" data-level="' + n + '"' +
        (locked ? ' data-locked="1"' : '') + '>' +
        (done ? '<span class="dot">✓</span>' : '') +
        '<b>' + n + '</b>' +
        '<i>' + t('worldLabel', { n: def.worldNumber }) + '</i>' +
        '</button>';
    }
    grid.innerHTML = html;
  }

  function gotoLevel(n) {
    if (isLocked(n)) {
      Audio.play('locked');
      toast(t('lockedToast', { n: progress.maxLevel }), 2200);
      return;
    }
    startLevel(n);
  }

  /* ---------------- game flow ---------------- */
  function startLevel(n) {
    hideBanner();
    closeOverlay();
    const def = Game.newGame(n, false);
    def.ghost = def.ghost && settings.ghost;
    if (Game.def) Game.def.ghost = def.ghost;
    Audio.unlock();
    Audio.play('click');
    refreshHud(true);
    buildPreviewList();
    toast(t('worldLabel', { n: def.worldNumber }) + ' · ' +
      L.worldName(def.world, I18n.locale()) + ' — ' + t('level') + ' ' + n, 2400);
  }

  function toMenu() {
    Game.state = 'menu';
    hideBanner();
    openOverlay('menu');
  }

  /* ---------------- previews ---------------- */
  let nextCanvases = [];
  function buildPreviewList() {
    const box = $('next-list');
    if (!box) return;
    box.innerHTML = '';
    nextCanvases = [];
    const count = Math.max(1, Game.def ? Game.def.preview : 3);
    for (let i = 0; i < count; i++) {
      const c = document.createElement('canvas');
      c.width = 108; c.height = 64;
      box.appendChild(c);
      nextCanvases.push(c);
    }
  }

  let lastNextKey = '';
  let lastHoldKey = '';
  function updatePreviews() {
    if (!Game.def || Game.state === 'menu') return;
    const ids = Game.peek(Game.def.preview);
    const key = ids.join(',');
    if (key !== lastNextKey) {
      lastNextKey = key;
      if (nextCanvases.length !== ids.length) buildPreviewList();
      ids.forEach(function (id, i) {
        if (nextCanvases[i]) {
          Render.drawPiece(nextCanvases[i], id, { cell: 24 });
          nextCanvases[i].style.opacity = i === 0 ? '1' : String(0.95 - i * 0.14);
        }
      });
    }
    const hk = Game.hold || '-';
    if (hk !== lastHoldKey) {
      lastHoldKey = hk;
      Render.drawPiece($('hold-canvas'), Game.hold, { cell: 26 });
      $('hold-canvas').style.opacity = Game.canHold ? '1' : '0.5';
    }
  }

  /* ---------------- HUD ---------------- */
  let hudCache = {};
  function setText(id, value) {
    if (hudCache[id] === value) return;
    hudCache[id] = value;
    const el = $(id);
    if (el) el.textContent = value;
  }

  function refreshHud(force) {
    const def = Game.def;
    if (!def) return;
    if (force) hudCache = {};

    setText('hud-level-name', L.worldName(def.world, I18n.locale()));
    setText('hud-tier', t('worldLabel', { n: def.worldNumber }) + ' · ' +
      L.tierName(def.tier, I18n.locale()));
    setText('hud-goal', Game.lines + '/' + def.linesGoal);
    setText('hud-lines', String(Game.lines));
    setText('hud-score', Game.score.toLocaleString());
    setText('hud-best', Math.max(progress.best, Game.score).toLocaleString());
    setText('hud-combo', Game.combo > 0 ? '×' + (Game.combo + 1) : '—');
    setText('hud-level-score', Game.levelScore.toLocaleString());
    setText('hud-speed', t('speedLine', { ms: def.gravityMs, das: def.dasMs }));
    setText('foot-progress', t('progressFoot', { done: progress.maxLevel }));

    const pct = Math.round(def.t * 100);
    const diff = $('hud-diff');
    if (diff && diff.dataset.v !== String(pct)) {
      diff.dataset.v = String(pct);
      diff.style.width = Math.max(4, pct) + '%';
    }
    const bar = $('hud-progress');
    const gpct = Math.min(100, Math.round(Game.lines / def.linesGoal * 100));
    if (bar && bar.dataset.v !== String(gpct)) {
      bar.dataset.v = String(gpct);
      bar.style.width = gpct + '%';
    }

    // modifiers
    const mods = L.modifiers(def);
    const mkey = mods.join(',');
    if (hudCache.mods !== mkey) {
      hudCache.mods = mkey;
      const box = $('hud-modifiers');
      if (box) {
        box.innerHTML = mods.map(function (m) {
          const tag = m.split(':')[0];
          const suffix = m.indexOf(':') > 0 ? ' (' + m.split(':')[1] + ')' : '';
          const good = tag === 'fairbag';
          const label = t('mod_' + tag.replace(/-/g, '_'));
          return '<span class="mod' + (good ? ' good' : '') + '">' +
            label + suffix + '</span>';
        }).join('');
      }
    }
  }

  function updateMenuProgress() {
    setText('menu-progress', t('menuProgress', {
      n: progress.maxLevel,
      score: progress.best.toLocaleString()
    }));
  }

  /* ---------------- game events ---------------- */
  Game.on('lineClear', function (e) {
    let key = 'clear' + e.lines;
    if (e.tspin) key = e.lines >= 2 ? 'clearTspin2' : 'clearTspin';
    toast(t(key) + (e.combo > 1 ? ' · ' + t('comboCall', { n: e.combo + 1 }) : ''), 1100);
    if (e.b2b) setTimeout(function () { toast(t('b2bCall'), 900); }, 700);
    Audio.play(e.tspin ? 'tspin' : 'clear' + Math.min(4, e.lines));
    if (e.combo > 0) Audio.play('combo', e.combo);
  });

  Game.on('garbage', function () { toast('⬇', 700); });

  Game.on('levelClear', function (e) {
    const isLast = e.level >= L.TOTAL;
    if (e.level + 1 > progress.maxLevel) {
      progress.maxLevel = Math.min(L.TOTAL, e.level + 1);
      saveProgress();
    }
    if (e.score > progress.best) { progress.best = e.score; saveProgress(); }
    refreshHud(true);

    const actions = [];
    if (isLast) {
      actions.push({ label: t('mainMenu'), fn: toMenu, primary: true });
      showBanner(t('victoryTitle'), t('victoryText') + ' ' + t('scoreLabel', { score: e.score.toLocaleString() }), actions);
    } else {
      actions.push({ label: t('nextLevel'), fn: function () { startLevel(e.level + 1); }, primary: true });
      actions.push({ label: t('levelSelect'), fn: function () { page = Math.floor((e.level) / (settings.pageSize || 50)); openOverlay('levels'); } });
      actions.push({ label: t('mainMenu'), fn: toMenu });
      showBanner(t('levelClearTitle'),
        t('levelClearText', { lines: e.lines, points: e.points.toLocaleString() }) +
        ' · ' + t('scoreLabel', { score: e.score.toLocaleString() }), actions);
    }
  });

  Game.on('gameOver', function (e) {
    if (e.score > progress.best) { progress.best = e.score; saveProgress(); }
    const key = 'lvl' + e.level;
    if (!progress.scores[key] || e.score > progress.scores[key]) {
      progress.scores[key] = e.score;
      saveProgress();
    }
    refreshHud(true);
    showBanner(t('gameOverTitle'),
      t('gameOverText', { n: e.level }) + ' ' + t('scoreLabel', { score: e.score.toLocaleString() }) +
      ' · ' + t('bestLabel', { score: (progress.scores[key] || 0).toLocaleString() }),
      [
        { label: t('retry'), fn: function () { startLevel(e.level); }, primary: true },
        { label: t('levelSelect'), fn: function () { page = Math.floor((e.level - 1) / (settings.pageSize || 50)); openOverlay('levels'); } },
        { label: t('mainMenu'), fn: toMenu }
      ]);
  });

  Game.on('pause', function () {
    showBanner(t('pausedTitle'), t('pausedText'), [
      { label: t('resume'), fn: function () { Game.togglePause(); hideBanner(); }, primary: true },
      { label: t('mainMenu'), fn: toMenu }
    ]);
  });
  Game.on('resume', function () { hideBanner(); });

  /* ---------------- input: keyboard ---------------- */
  const held = { left: false, right: false, down: false };
  let dir = 0, dasTimer = 0, arrTimer = 0, softTimer = 0;

  function pressDir(d) {
    if (dir !== d) { dir = d; dasTimer = 0; arrTimer = 0; Game.move(d); }
  }

  function onKeyDown(e) {
    const k = e.key;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;

    // overlay open
    if (overlayOpen) {
      if (k === 'Escape' && view !== 'menu') { e.preventDefault(); Audio.play('click'); openOverlay('menu'); }
      return;
    }

    const code = e.code;
    const prevent = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space', 'Enter'].indexOf(code) >= 0;
    if (prevent) e.preventDefault();

    if (bannerOpen) {
      if (code === 'Enter' || code === 'Space') {
        const first = document.querySelector('#banner-actions .btn');
        if (first) first.click();
      }
      if (code === 'Escape') toMenu();
      return;
    }

    Audio.unlock();

    switch (code) {
      case 'ArrowLeft': case 'KeyA':
        if (!held.left) { held.left = true; pressDir(-1); }
        break;
      case 'ArrowRight': case 'KeyD':
        if (!held.right) { held.right = true; pressDir(1); }
        break;
      case 'ArrowDown': case 'KeyS':
        if (!held.down) { held.down = true; softTimer = 0; Game.softDrop(); }
        break;
      case 'ArrowUp': case 'KeyX': case 'ControlRight':
        if (!e.repeat) Game.rotate(1);
        break;
      case 'KeyZ': case 'ControlLeft':
        if (!e.repeat) Game.rotate(-1);
        break;
      case 'Space':
        if (!e.repeat) Game.hardDrop();
        break;
      case 'KeyC': case 'ShiftLeft': case 'ShiftRight':
        if (!e.repeat) Game.holdPiece();
        break;
      case 'KeyP': case 'Escape':
        if (!e.repeat) { if (!Game.togglePause() && code === 'Escape') toMenu(); }
        break;
      case 'KeyM':
        setSound(!settings.sound);
        break;
      case 'Enter':
        if (!e.repeat && Game.state === 'menu') startLevel(progress.maxLevel);
        break;
      default: break;
    }
  }

  function onKeyUp(e) {
    const code = e.code;
    if (code === 'ArrowLeft' || code === 'KeyA') {
      held.left = false;
      if (dir === -1) { dir = held.right ? 1 : 0; dasTimer = 0; arrTimer = 0; if (dir) Game.move(dir); }
    } else if (code === 'ArrowRight' || code === 'KeyD') {
      held.right = false;
      if (dir === 1) { dir = held.left ? -1 : 0; dasTimer = 0; arrTimer = 0; if (dir) Game.move(dir); }
    } else if (code === 'ArrowDown' || code === 'KeyS') {
      held.down = false;
    }
  }

  function stepInput(dt) {
    if (Game.state !== 'playing') { dir = 0; held.down = false; return; }
    const def = Game.def;

    if (dir !== 0) {
      dasTimer += dt;
      if (dasTimer >= def.dasMs) {
        arrTimer += dt;
        let guard = 0;
        while (arrTimer >= def.arrMs && guard++ < 20) {
          arrTimer -= def.arrMs;
          if (!Game.move(dir)) { arrTimer = 0; break; }
        }
      }
    }

    if (held.down) {
      softTimer += dt;
      const interval = Math.max(28, Math.min(55, def.gravityMs / 4));
      let guard = 0;
      while (softTimer >= interval && guard++ < 20) {
        softTimer -= interval;
        if (!Game.softDrop()) break;
      }
    }
  }

  /* ---------------- input: touch ---------------- */
  function bindTouch() {
    document.querySelectorAll('.tbtn').forEach(function (btn) {
      const action = btn.dataset.action;
      const isHold = action === 'left' || action === 'right' || action === 'softDrop';

      function down(e) {
        e.preventDefault();
        Audio.unlock();
        if (action === 'pause') { Game.togglePause(); return; }
        if (action === 'left') { held.left = true; pressDir(-1); }
        else if (action === 'right') { held.right = true; pressDir(1); }
        else if (action === 'softDrop') { held.down = true; softTimer = 0; Game.softDrop(); }
        else if (action === 'rotateCW') Game.rotate(1);
        else if (action === 'rotateCCW') Game.rotate(-1);
        else if (action === 'hardDrop') Game.hardDrop();
        else if (action === 'hold') Game.holdPiece();
        if (isHold) btn.dataset.pressed = '1';
      }
      function up() {
        if (action === 'left') { held.left = false; if (dir === -1) { dir = held.right ? 1 : 0; dasTimer = 0; arrTimer = 0; } }
        if (action === 'right') { held.right = false; if (dir === 1) { dir = held.left ? -1 : 0; dasTimer = 0; arrTimer = 0; } }
        if (action === 'softDrop') held.down = false;
        delete btn.dataset.pressed;
      }
      btn.addEventListener('pointerdown', down);
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointerleave', up);
      btn.addEventListener('pointercancel', up);
    });

    // swipe / tap on the board
    const canvas = $('board');
    if (!canvas) return;
    let start = null, lastCell = 0;
    canvas.addEventListener('pointerdown', function (e) {
      if (Game.state !== 'playing') return;
      start = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
      canvas.setPointerCapture(e.pointerId);
      Audio.unlock();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!start) return;
      const step = Math.max(22, Render.cell);
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const wantX = Math.trunc(dx / step);
      const wantY = Math.trunc(dy / step);
      while (lastCell < wantX) { Game.move(1); lastCell++; start.moved = true; }
      while (lastCell > wantX) { Game.move(-1); lastCell--; start.moved = true; }
      if (wantY > 0) { while ((start.lastY || 0) < wantY) { Game.softDrop(); start.lastY = (start.lastY || 0) + 1; start.moved = true; } }
    });
    canvas.addEventListener('pointerup', function (e) {
      if (!start) return;
      const dt = Date.now() - start.t;
      const dy = e.clientY - start.y;
      if (!start.moved && dt < 260) Game.rotate(1);
      else if (dy > 90 && dt < 320) Game.hardDrop();
      start = null; lastCell = 0;
    });
    canvas.addEventListener('pointercancel', function () { start = null; lastCell = 0; });
  }

  /* ---------------- settings & language ---------------- */
  function setSound(on) {
    settings.sound = !!on;
    Audio.enabled = settings.sound;
    const b = $('btn-sound');
    if (b) {
      b.classList.toggle('off', !settings.sound);
      b.textContent = settings.sound ? '🔔' : '🔕';
    }
    saveSettings();
  }

  function syncSettingsForm() {
    const s = $('set-sound'), u = $('set-unlock'), g = $('set-ghost'), lang = $('set-lang');
    if (s) s.checked = settings.sound;
    if (u) u.checked = settings.unlockAll;
    if (g) g.checked = settings.ghost;
    if (lang) lang.value = I18n.current;
  }

  function bindUI() {
    $('btn-start').addEventListener('click', function () { startLevel(progress.maxLevel); });
    $('btn-continue').addEventListener('click', function () { startLevel(progress.maxLevel); });
    $('btn-levels').addEventListener('click', function () {
      page = Math.floor((Math.max(1, progress.maxLevel) - 1) / (settings.pageSize || 50));
      Audio.play('click');
      openOverlay('levels');
    });
    $('btn-howto').addEventListener('click', function () { Audio.play('click'); openOverlay('howto'); });
    $('btn-settings').addEventListener('click', function () { Audio.play('click'); openOverlay('settings'); });

    document.querySelectorAll('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () { Audio.play('click'); openOverlay(b.dataset.back); });
    });

    $('pg-prev').addEventListener('click', function () { page--; renderLevelGrid(); Audio.play('click'); });
    $('pg-next').addEventListener('click', function () { page++; renderLevelGrid(); Audio.play('click'); });
    $('pg-size').addEventListener('change', function () {
      settings.pageSize = parseInt(this.value, 10) || 50;
      saveSettings(); page = 0; renderLevelGrid();
    });
    $('level-grid').addEventListener('click', function (e) {
      const btn = e.target.closest('.lvl');
      if (!btn) return;
      gotoLevel(parseInt(btn.dataset.level, 10));
    });

    $('btn-sound').addEventListener('click', function () { setSound(!settings.sound); });
    $('btn-pause').addEventListener('click', function () {
      if (!overlayOpen && !bannerOpen) Game.togglePause();
    });
    $('btn-help').addEventListener('click', function () {
      if (Game.state === 'playing') Game.togglePause();
      openOverlay('howto');
    });

    $('lang-select').addEventListener('change', function () { I18n.set(this.value); });
    $('set-lang').addEventListener('change', function () { I18n.set(this.value); });
    $('set-sound').addEventListener('change', function () { setSound(this.checked); });
    $('set-unlock').addEventListener('change', function () {
      settings.unlockAll = this.checked; saveSettings();
      toast(this.checked ? '🔓' : '🔒', 800);
    });
    $('set-ghost').addEventListener('change', function () {
      settings.ghost = this.checked; saveSettings();
      if (Game.def) Game.def.ghost = Game.def.ghost && settings.ghost;
    });
    $('btn-reset').addEventListener('click', function () {
      if (!confirm(t('confirmReset'))) return;
      progress.maxLevel = 1; progress.best = 0; progress.scores = {};
      saveProgress();
      refreshHud(true);
      updateMenuProgress();
      toast('✓', 900);
    });

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', function () { Render.resize(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && Game.state === 'playing') Game.togglePause();
    });
    bindTouch();
  }

  /* ---------------- language change ---------------- */
  I18n.onChange(function () {
    I18n.apply();
    refreshHud(true);
    lastNextKey = ''; lastHoldKey = '';
    if (overlayOpen) openOverlay(view);
    if (bannerOpen && Game.state === 'paused') {
      showBanner(t('pausedTitle'), t('pausedText'), [
        { label: t('resume'), fn: function () { Game.togglePause(); hideBanner(); }, primary: true },
        { label: t('mainMenu'), fn: toMenu }
      ]);
    }
    const s = $('lang-select'); if (s) s.value = I18n.current;
    updateMenuProgress();
  });

  /* ---------------- loop ---------------- */
  let last = 0;
  let hudTimer = 0;

  function frame(now) {
    if (!last) last = now;
    const dt = Math.min(100, now - last);
    last = now;

    if (Game.state !== 'menu') {
      stepInput(dt);
      Game.update(dt);
      refreshHud();
      updatePreviews();
    }

    const bgDef = Game.def || L.get(progress.maxLevel);
    Render.drawBackground(bgDef, now);
    Render.draw(Game, now);

    hudTimer += dt;
    if (hudTimer > 500) {
      hudTimer = 0;
      if (Game.state === 'menu') updateMenuProgress();
    }

    requestAnimationFrame(frame);
  }

  /* ---------------- boot ---------------- */
  function init() {
    loadAll();
    I18n.init();
    Audio.enabled = settings.sound;

    Render.resize();
    if (!Render.bctx) { console.error('canvas unavailable'); return; }

    bindUI();
    buildPreviewList();
    setSound(settings.sound);
    refreshHud(true);
    updateMenuProgress();
    openOverlay('menu');

    const sel = $('lang-select');
    if (sel) sel.value = I18n.current;

    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.MT_App = {
    settings: settings,
    progress: progress,
    startLevel: startLevel,
    isLocked: isLocked
  };
})(typeof window !== 'undefined' ? window : globalThis);
