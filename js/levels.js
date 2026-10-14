/* ============================================================
   THE 1000 LEVELS
   ------------------------------------------------------------
   100 worlds x 10 levels = 1000 levels, from VERY EASY to VERY
   HARD. Everything is computed procedurally from the level
   number, so level 37 always plays exactly the same way and no
   level data file is ever needed.

   Difficulty t = (n-1)/999 runs 0 -> 1 across the whole game.
   Level 1 is a stroll; level 500 is roughly a third of the way
   in; level 1000 is merciless.

   Tunable knobs (see docs/LEVELS.md for the full table):
     gravityMs      ms per row of natural fall
     lockDelayMs    grace period once a piece lands
     lockResets     how many moves/rotations refresh that timer
     dasMs / arrMs  horizontal responsiveness
     preview        how many upcoming pieces are shown
     ghost          landing preview piece
     garbageRows    pre-filled rows at spawn
     garbageEveryMs periodic garbage row (0 = never)
     linesGoal      lines required to clear the level
     pool           '5' = fair bag (I J L O T) | '7' = full bag
     multiplier     score multiplier
   ============================================================ */
(function (global) {
  'use strict';

  const TOTAL_LEVELS = 1000;
  const LEVELS_PER_WORLD = 10;
  const WORLDS = TOTAL_LEVELS / LEVELS_PER_WORLD; // 100
  const TIERS = 10;                               // 100 levels per tier

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerpExp(a, b, t) { return a * Math.pow(b / a, t); }

  function difficulty(n) {
    return clamp((n - 1) / (TOTAL_LEVELS - 1), 0, 1);
  }

  /** World definition (0..99) for a level number. */
  function worldOf(n) {
    return Math.floor((n - 1) / LEVELS_PER_WORLD);
  }

  /** Localised world name: "<Realm> <link> <Qualifier>" e.g. "Kingdom of Ash". */
  function worldName(worldIndex, locale) {
    const loc = locale || {};
    const nouns = loc.worldNoun || ['Realm'];
    const quals = loc.worldQual || ['Fire'];
    const link = loc.worldLink != null ? loc.worldLink : 'of';
    const noun = nouns[worldIndex % nouns.length];
    const qual = quals[Math.floor(worldIndex / nouns.length) % quals.length];
    if (!link) return noun + ' ' + qual;
    return noun + ' ' + link + ' ' + qual;
  }

  /** Tier (0..9) — 10 ranks of 100 levels: Page -> Legend. */
  function tierIndex(n) {
    return Math.floor((n - 1) / (TOTAL_LEVELS / TIERS));
  }

  function tierName(idx, locale) {
    const list = (locale && locale.tiers) || ['Page'];
    return list[clamp(idx, 0, list.length - 1)];
  }

  /** The full definition of one level. */
  function get(n) {
    n = clamp(Math.round(n), 1, TOTAL_LEVELS);
    const t = difficulty(n);
    const world = worldOf(n);
    const tier = tierIndex(n);

    // --- speed ---------------------------------------------------------
    const gravityMs    = Math.round(lerpExp(1000, 48, t));
    const lockDelayMs  = Math.round(lerpExp(900, 100, t));
    const lockResets   = Math.round(15 - 7 * t);
    const dasMs        = Math.round(lerpExp(170, 62, t));
    const arrMs        = Math.round(lerpExp(45, 16, t));

    // --- information / assistance --------------------------------------
    const preview = t < 0.25 ? 5 : t < 0.5 ? 4 : t < 0.75 ? 3 : t < 0.9 ? 2 : 1;
    const ghost   = t < 0.9;           // last 100 levels: no landing preview

    // --- adversity ------------------------------------------------------
    const garbageRows = t < 0.3 ? 0 : Math.min(5, Math.floor((t - 0.3) * 8));
    const garbageEveryMs = t < 0.75 ? 0 : Math.round(14000 - ((t - 0.75) / 0.25) * 9000);

    // --- goal & economy -------------------------------------------------
    const linesGoal  = Math.round(4 + t * 10);      // 4 -> 14 lines
    const multiplier = Math.round((1 + t * 2) * 100) / 100; // 1.00 -> 3.00
    const pool = t < 0.2 ? '5' : '7';               // fair bag early on

    // --- theme ----------------------------------------------------------
    const hue = (world * 37 + 12) % 360;
    const scene = world % 6;                        // 6 procedural backdrops

    return {
      n: n,
      t: t,
      world: world,                 // 0..99
      worldNumber: world + 1,       // 1..100
      inWorld: ((n - 1) % LEVELS_PER_WORLD) + 1, // 1..10
      tier: tier,                   // 0..9
      gravityMs: gravityMs,
      lockDelayMs: lockDelayMs,
      lockResets: lockResets,
      dasMs: dasMs,
      arrMs: arrMs,
      preview: preview,
      ghost: ghost,
      garbageRows: garbageRows,
      garbageEveryMs: garbageEveryMs,
      linesGoal: linesGoal,
      multiplier: multiplier,
      pool: pool,
      hue: hue,
      scene: scene,
      seed: n * 7919 + 104729
    };
  }

  /** Machine-readable modifier tags (for the HUD + tests). */
  function modifiers(def) {
    const tags = [];
    if (def.pool === '5') tags.push('fairbag');
    if (def.garbageRows > 0) tags.push('garbage-start:' + def.garbageRows);
    if (def.garbageEveryMs > 0) tags.push('garbage-storm');
    if (def.preview <= 1) tags.push('blind-next');
    if (!def.ghost) tags.push('no-ghost');
    return tags;
  }

  global.MT_Levels = {
    TOTAL: TOTAL_LEVELS,
    LEVELS_PER_WORLD: LEVELS_PER_WORLD,
    WORLDS: WORLDS,
    TIERS: TIERS,
    difficulty: difficulty,
    worldOf: worldOf,
    worldName: worldName,
    tierIndex: tierIndex,
    tierName: tierName,
    get: get,
    modifiers: modifiers
  };
})(typeof window !== 'undefined' ? window : globalThis);
