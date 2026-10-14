# ⚔️ Medieval Tetris — 1000 Levels

**Live game: [https://tetris-medieval.vercel.app](https://tetris-medieval.vercel.app)**

A complete, zero-dependency Tetris with **1000 playable levels**, from *very easy* to
*very difficult*, wrapped in a medieval world: stone walls, heraldic gem blocks,
castle backdrops, torch light and ranks that run from **Page** to **Legend**.

Built with plain HTML5 canvas + JavaScript — no build step, no framework, no
`npm install`. Playable straight from `index.html` (even over `file://`) and
deployed as a static site on Vercel.

![Medieval Tetris — level 563 gameplay](docs/screenshot.png)

<p align="center">
  <a href="https://tetris-medieval.vercel.app"><strong>▶ Play now</strong></a> ·
  <a href="docs/LEVELS.md"><strong>Level design</strong></a> ·
  <a href="docs/I18N.md"><strong>Translations</strong></a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a>
</p>

---

## Run it

**Option A — just double-click `index.html`** (works from `file://`, no server).

**Option B — local server:**

```bash
npm start          # → http://localhost:8090
# or: node serve.js 8090
```

**Option C — any static server** (`python -m http.server`, `npx serve`, …).

## How to play

| Control | Action |
| --- | --- |
| `←` `→` / `A` `D` | Move |
| `↓` / `S` | Soft drop |
| `↑` / `X` | Rotate clockwise |
| `Z` / `Ctrl` | Rotate counter-clockwise |
| `Space` | Hard drop |
| `C` / `Shift` | Hold a piece |
| `P` / `Esc` | Pause · `M` Mute |
| Touch | On-screen pad, or tap/drag on the board |

- Stack the tetrominoes inside the castle wall; a **complete row of stone is destroyed**.
- Clear the number of lines the level asks for → the gate to the next level opens.
- **Hold** keeps one piece in reserve until you need it; the **ghost** shows where it lands.

## Scoring

| Action | Points |
| --- | --- |
| Single / Double / Triple | 100 / 300 / 500 |
| **Tetris** (4 lines) | **800** |
| T-Spin single / double | 400 / 1200 |
| Back-to-back bonus | ×1.5 |
| Combo (each extra row in a chain) | +50 × combo |
| Soft drop / hard drop | +1 / +2 per cell |
| Level multiplier | ×1.00 → ×3.00 as you climb |

---

## The 1000 levels

- **100 worlds × 10 levels**, grouped into **10 ranks**: Page → Squire → Knight →
  Baron → Viscount → Count → Duke → King → Emperor → **Legend**.
- Every world has a name built from its realm and its element
  (*Kingdom of Fire*, *Realm of Blood*, *Reich des Feuers*, *Reino de Fogo* …),
  a colour theme and one of **6 procedurally drawn backdrops** (castle, forest,
  mountains, cathedral, volcano, starlit siege).
- Difficulty `t = (n-1)/999` runs **0 → 1** across the whole game. Level 1 is a
  stroll; level 1000 is merciless:

| Knob | Level 1 | Level 250 | Level 500 | Level 750 | Level 1000 |
| --- | --- | --- | --- | --- | --- |
| Gravity (ms/row) | 1000 | 469 | 219 | 103 | **48** |
| Lock delay | 900 ms | 520 ms | 300 ms | 173 ms | **100 ms** |
| Move repeat (DAS) | 170 ms | 132 ms | 103 ms | 80 ms | **62 ms** |
| Pieces previewed | 5 | 5 | 4 | 3 | **1** |
| Starting garbage rows | 0 | 0 | 1 | 3 | **5** |
| Lines per level | 4 | 6 | 9 | 11 | **14** |
| Score multiplier | 1.00× | 1.50× | 2.00× | 2.50× | **3.00×** |

On top of that:

- **Fair bag** (I J L O T only) for levels 1–200, full 7-piece bag afterwards.
- **Garbage storm** from level 751 on: a new stone row rises every 14 s → every 5 s.
- The **landing ghost disappears for the last 100 levels**.
- Lock resets drop from 15 → 8, so late levels punish indecision.

Everything is **generated procedurally from the level number**, so level 37 always
looks and plays exactly the same, and there is no level data file to download.
Full details in [docs/LEVELS.md](docs/LEVELS.md).

**Level Select** pages through all 1000 levels (25 / 50 / 100 per page), marks the
levels you have beaten and locks the rest — or flip *Unlock every level* in
Settings to explore freely. Progress, best score, language and sound persist in
`localStorage`.

## 🌍 6 languages

English · Español · Français · Deutsch · Italiano · Português

Switch any time from the top bar (🌐) or Settings; the choice is remembered and
the browser language is detected on first visit. All UI strings live in
[`js/locales/`](js/locales) — 79 keys each — plus localised world names, rank
names and line-clear callouts. See [docs/I18N.md](docs/I18N.md).

## 🧪 Tests

```bash
npm test
# 42 checks, runs in ~1 s
```

`test/levels.test.js` (plain Node, no dependencies) verifies:

- all **6 locales exist, share the exact same keys**, keep every `{placeholder}`,
  and translate **every** UI key used by `index.html` and `main.js` — including
  the level-modifier labels;
- all **1000 levels exist**, are **deterministic**, and the difficulty ramp is
  monotonic (gravity, lock delay, DAS, ARR, preview, goals, multiplier, garbage);
- level 1 is genuinely easy and level 1000 genuinely hard (20× speed-up);
- 100 worlds × 10 levels, 10 ranks × 100 levels, 100 unique world names per language;
- all 7 tetrominoes have 4 rotations × 4 cells and full SRS kick tables;
- a **real gameplay simulation**: move/rotate/hold/hard-drop work, gravity locks
  pieces by itself, line clears and scoring fire, levels 1/250/500/750/1000 are
  all beatable, garbage is reproducible, and pause freezes the game.

## 📁 Project structure

```
index.html          shell, HUD, menus, level select, overlays
style.css           medieval look: parchment, stone, gold, responsive + touch pad
js/
  rng.js            seeded RNG (mulberry32) — deterministic levels
  pieces.js         7 tetrominoes, SRS rotation + wall kicks, heraldic palette
  levels.js         the 1000 level definitions (procedural)
  game.js           engine: board, gravity, lock delay, scoring, garbage, events
  render.js         canvas renderer + block sprites + 6 procedural backdrops
  audio.js          WebAudio synth (no audio files)
  i18n.js           6-language runtime (data-i18n + t())
  locales/          en, es, fr, de, it, pt (79 keys each)
  main.js           UI, keyboard/touch input, persistence, main loop
test/levels.test.js 42-check test suite
docs/               level design + translation guide
serve.js            tiny static server for local testing
```

## 🚀 Deployment

The site is deployed on **Vercel** at **https://tetris-medieval.vercel.app**.

```bash
vercel --prod        # static deploy, no build step
```

`.vercelignore` ships only the game files (docs and tests stay in the repo).
Source lives on GitHub: [`HarleyVasquezcom/Medieval-Tetris`](https://github.com/HarleyVasquezcom/Medieval-Tetris).

## License

MIT — use it, fork it, teach with it.
