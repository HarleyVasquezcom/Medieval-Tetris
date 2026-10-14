/* ============================================================
   Pieces — the 7 tetrominoes, SRS rotation + wall kicks.
   Heraldic palette: each piece is a coat-of-arms colour.
   ============================================================ */
(function (global) {
  'use strict';

  // Base shapes as matrices (spinning happens around the matrix)
  const BASE = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]],
    O: [[1,1],[1,1]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]]
  };

  const IDS = ['I','J','L','O','S','T','Z'];

  // Coat-of-arms colours (index 1..7 match board cell values)
  const PALETTE = [
    null,
    { id:'I', name:'azure',   base:'#2f9bd6', light:'#9fe0ff', dark:'#12496b' }, // Azure
    { id:'J', name:'cobalt',  base:'#3b5bd6', light:'#a9bcff', dark:'#1b2c72' }, // Cobalt
    { id:'L', name:'gold',    base:'#e0a32c', light:'#ffe6a1', dark:'#7d5510' }, // Gold
    { id:'O', name:'sun',     base:'#e5d43a', light:'#fffbb8', dark:'#807009' }, // Sun
    { id:'S', name:'emerald', base:'#3fae5a', light:'#b3f5c2', dark:'#1a5c2c' }, // Emerald
    { id:'T', name:'royal',   base:'#a44fd0', light:'#e8c6ff', dark:'#54216e' }, // Royal purple
    { id:'Z', name:'crimson', base:'#cf3b3b', light:'#ffb3b3', dark:'#701717' }  // Crimson
  ];

  function rotateCW(m) {
    const n = m.length;
    const out = [];
    for (let y = 0; y < n; y++) {
      out.push([]);
      for (let x = 0; x < n; x++) out[y].push(m[n - 1 - x][y]);
    }
    return out;
  }

  function rotateCCW(m) {
    const n = m.length;
    const out = [];
    for (let y = 0; y < n; y++) {
      out.push([]);
      for (let x = 0; x < n; x++) out[y].push(m[x][n - 1 - y]);
    }
    return out;
  }

  // Pre-compute the 4 rotation states of every piece
  const STATES = {};
  IDS.forEach(function (id) {
    const states = [BASE[id]];
    for (let i = 1; i < 4; i++) states.push(rotateCW(states[i - 1]));
    STATES[id] = states;
  });

  // SRS kick data. y is UP-positive in the spec; we store it flipped
  // (DOWN-positive) so it can be applied straight to grid coordinates.
  const KICKS_JLSTZ = {
    '0>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '1>0': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    '1>2': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    '2>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '2>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    '3>2': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '3>0': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '0>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]]
  };
  const KICKS_I = {
    '0>1': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
    '1>0': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
    '1>2': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
    '2>1': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
    '2>3': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
    '3>2': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
    '3>0': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
    '0>3': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]]
  };

  function kicks(piece, from, to) {
    if (piece === 'O') return [[0,0]];
    const key = from + '>' + to;
    const table = piece === 'I' ? KICKS_I : KICKS_JLSTZ;
    return table[key] || [[0,0]];
  }

  // Cells of a piece at a given rotation state (relative coords)
  function cells(id, rot) {
    const m = STATES[id][rot & 3];
    const out = [];
    for (let y = 0; y < m.length; y++)
      for (let x = 0; x < m.length; x++)
        if (m[y][x]) out.push([x, y]);
    return out;
  }

  // Piece cell index inside the matrix (for spawn centring)
  function bounds(id, rot) {
    const cs = cells(id, rot);
    let minX = 99, maxX = -99, minY = 99, maxY = -99;
    cs.forEach(function (c) {
      if (c[0] < minX) minX = c[0];
      if (c[0] > maxX) maxX = c[0];
      if (c[1] < minY) minY = c[1];
      if (c[1] > maxY) maxY = c[1];
    });
    return { minX:minX, maxX:maxX, minY:minY, maxY:maxY, w:maxX-minX+1, h:maxY-minY+1 };
  }

  const colorIndex = {}; // 'I' -> 1
  IDS.forEach(function (id, i) { colorIndex[id] = i + 1; });

  global.MT_Pieces = {
    IDS: IDS,
    BASE: BASE,
    STATES: STATES,
    PALETTE: PALETTE,
    colorIndex: colorIndex,
    cells: cells,
    bounds: bounds,
    kicks: kicks,
    rotateCW: rotateCW,
    rotateCCW: rotateCCW
  };
})(typeof window !== 'undefined' ? window : globalThis);
