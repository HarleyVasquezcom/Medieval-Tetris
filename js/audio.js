/* ============================================================
   Audio — tiny WebAudio synth (no files, no dependencies).
   Lute-like plucks, stone thuds and harpsichord fanfares.
   ============================================================ */
(function (global) {
  'use strict';

  let ctx = null;
  let enabled = true;
  let master = null;

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }

  function unlock() {
    const c = ensure();
    if (c && c.state === 'suspended') c.resume();
  }

  function tone(freq, dur, type, when, gain, slideTo) {
    const c = ensure();
    if (!c || !enabled) return;
    const t0 = c.currentTime + (when || 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || 'triangle';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.25, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0 + dur + 0.03);
  }

  function noise(dur, gain, freq) {
    const c = ensure();
    if (!c || !enabled) return;
    const t0 = c.currentTime;
    const frames = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, frames, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = freq || 900;
    const g = c.createGain();
    g.gain.value = gain || 0.28;
    src.connect(filter); filter.connect(g); g.connect(master);
    src.start(t0);
  }

  const SFX = {
    move:    function () { tone(330, 0.06, 'square', 0, 0.10); },
    rotate:  function () { tone(520, 0.09, 'triangle', 0, 0.16); tone(660, 0.07, 'triangle', 0.04, 0.10); },
    hold:    function () { tone(440, 0.10, 'sine', 0, 0.16); tone(330, 0.12, 'sine', 0.06, 0.13); },
    lock:    function () { tone(180, 0.13, 'sine', 0, 0.24, 120); noise(0.09, 0.10, 700); },
    drop:    function () { noise(0.16, 0.34, 500); tone(140, 0.16, 'sine', 0, 0.28, 70); },
    soft:    function () { tone(240, 0.04, 'square', 0, 0.06); },
    clear1:  function () { [523, 659].forEach(function (f, i) { tone(f, 0.16, 'triangle', i * 0.06, 0.22); }); },
    clear2:  function () { [523, 659, 784].forEach(function (f, i) { tone(f, 0.16, 'triangle', i * 0.06, 0.22); }); },
    clear3:  function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.17, 'triangle', i * 0.055, 0.23); }); },
    clear4:  function () {
      [392, 523, 659, 784, 1046, 1318].forEach(function (f, i) { tone(f, 0.2, 'triangle', i * 0.05, 0.25); });
      noise(0.3, 0.14, 2400);
    },
    tspin:   function () { [440, 587, 880].forEach(function (f, i) { tone(f, 0.2, 'sawtooth', i * 0.06, 0.16); }); },
    combo:   function (n) { tone(660 + Math.min(n, 8) * 55, 0.14, 'square', 0, 0.16); },
    b2b:     function () { tone(1046, 0.22, 'sawtooth', 0, 0.14); tone(1568, 0.2, 'sawtooth', 0.07, 0.12); },
    levelup: function () {
      [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.26, 'triangle', i * 0.08, 0.26); });
      tone(1568, 0.5, 'sine', 0.34, 0.16);
    },
    gameover: function () {
      [440, 392, 330, 262].forEach(function (f, i) { tone(f, 0.42, 'sawtooth', i * 0.16, 0.20, f * 0.8); });
    },
    click:   function () { tone(700, 0.05, 'square', 0, 0.09); },
    locked:  function () { tone(160, 0.16, 'square', 0, 0.14, 110); },
    garbage: function () { noise(0.35, 0.24, 320); tone(90, 0.3, 'sine', 0, 0.22, 60); }
  };

  function play(name, arg) {
    if (!enabled) return;
    const fn = SFX[name];
    if (fn) { unlock(); try { fn(arg); } catch (e) { /* ignore */ } }
  }

  global.MT_Audio = {
    play: play,
    unlock: unlock,
    get enabled() { return enabled; },
    set enabled(v) { enabled = !!v; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
