/* ============================================================
   Seeded RNG — mulberry32 (deterministic, fast, dependency free)
   Used for garbage rows, themes and any level randomness so that
   level N always plays exactly the same way.
   ============================================================ */
(function (global) {
  'use strict';

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const MT_RNG = {
    mulberry32: mulberry32,
    // integer in [0, n)
    int: function (rand, n) { return Math.floor(rand() * n); },
    // deterministic shuffle (Fisher–Yates)
    shuffle: function (rand, arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    }
  };

  global.MT_RNG = MT_RNG;
})(typeof window !== 'undefined' ? window : globalThis);
