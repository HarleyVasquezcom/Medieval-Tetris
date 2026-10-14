# Level design — the 1000 levels

Every level is a pure function of its number:

```js
MT_Levels.get(n)   // n = 1..1000  →  the whole level definition
```

Nothing is stored, nothing is downloaded: the same `n` always produces the same
gravity, the same garbage, the same seed and therefore the same game.

## Structure

| | |
| --- | --- |
| Levels | 1000 |
| Worlds | 100 (10 levels each) |
| Ranks (tiers) | 10 (100 levels each) |
| Difficulty | `t = (n - 1) / 999`, runs `0 → 1` |
| Board | 10 × 20 visible + 4 hidden spawn rows |
| Seed | `n * 7919 + 104729` (garbage, themes, bag order) |

## Ranks

| Levels | Rank (en) | es | fr | de | it | pt |
| --- | --- | --- | --- | --- | --- | --- |
| 1–100 | Page | Paje | Page | Page | Paggio | Pajem |
| 101–200 | Squire | Escudero | Écuyer | Knappe | Scudiero | Escudeiro |
| 201–300 | Knight | Caballero | Chevalier | Ritter | Cavaliere | Cavaleiro |
| 301–400 | Baron | Barón | Baron | Baron | Barone | Barão |
| 401–500 | Viscount | Vizconde | Vicomte | Vizegraf | Visconte | Visconde |
| 501–600 | Count | Conde | Comte | Graf | Conte | Conde |
| 601–700 | Duke | Duque | Duc | Herzog | Duca | Duque |
| 701–800 | King | Rey | Roi | König | Re | Rei |
| 801–900 | Emperor | Emperador | Empereur | Kaiser | Imperatore | Imperador |
| 901–1000 | Legend | Leyenda | Légende | Legende | Leggenda | Lenda |

## World names

World `w` (0–99) = `worldNoun[floor(w/10)] + " " + worldLink + " " + worldQual[w mod 10]`.

10 realms × 10 elements = **100 unique names**, re-declinated per language so the
grammar holds (`Kingdom of Fire`, `Reino de Fuego`, `Royaume de Feu`,
`Reich des Feuers`, `Regno di Fuoco`, `Reino de Fogo`). The test suite asserts
that all 100 names are unique in each of the 6 languages.

## Knobs

| Knob | Formula | L1 | L250 | L500 | L750 | L1000 |
| --- | --- | --- | --- | --- | --- | --- |
| `gravityMs` | `lerp(1000 → 48, exp)` | 1000 | 469 | 219 | 103 | 48 |
| `lockDelayMs` | `lerp(900 → 100, exp)` | 900 | 520 | 300 | 173 | 100 |
| `lockResets` | `round(15 - 7t)` | 15 | 13 | 12 | 10 | 8 |
| `dasMs` | `lerp(170 → 62, exp)` | 170 | 132 | 103 | 80 | 62 |
| `arrMs` | `lerp(45 → 16, exp)` | 45 | 35 | 27 | 21 | 16 |
| `preview` | 5 / 4 / 3 / 2 / 1 by `t` | 5 | 5 | 4 | 3 | 1 |
| `ghost` | `t < 0.9` | ✓ | ✓ | ✓ | ✓ | ✗ |
| `garbageRows` | `0` until `t ≥ 0.3`, then up to 5 | 0 | 0 | 1 | 3 | 5 |
| `garbageEveryMs` | `0` until `t = 0.75`, then 14 s → 5 s | — | — | — | 14 s | 5 s |
| `linesGoal` | `round(4 + 10t)` | 4 | 6 | 9 | 11 | 14 |
| `multiplier` | `round(1 + 2t, 2)` | 1.00 | 1.50 | 2.00 | 2.50 | 3.00 |
| `pool` | `'5'` (fair bag) while `t < 0.2`, else `'7'` | 5-bag | 5-bag | 7-bag | 7-bag | 7-bag |
| `hue` / `theme` | `world` | theme 1 | … | … | … | theme 100 |

`lerp(a → b, exp)` means exponential interpolation: `a * (b/a)^t`, so the ramp
feels linear *in perceived speed* instead of collapsing all the interesting
difficulty into the last 50 levels.

## Modifier tags

`MT_Levels.modifiers(def)` returns machine-readable tags; the HUD shows them as
localised chips:

| Tag | HUD label (en) | When |
| --- | --- | --- |
| `fairbag` | Fair bag | levels 1–200 (beneficial) |
| `garbage-start:N` | Pre-filled rows (N) | from level 426 |
| `garbage-storm` | Garbage storm | from level 751 |
| `blind-next` | One preview | last 100 levels |
| `no-ghost` | No ghost | last 100 levels |

Every tag must have a `mod_<tag>` key in **all six locales** — the test suite
fails otherwise.

## Why procedural?

1. **Zero payload** — 1000 levels cost 0 bytes instead of a large JSON file.
2. **Provably monotonic** — the ramp is a formula, so the test can assert that
   difficulty never decreases anywhere in the 1000 levels.
3. **Reproducible** — the same level always plays the same (useful for bug
   reports, challenges and speedruns).
4. **Tunable** — changing one constant re-balances the whole game, and the test
   suite immediately reports the new ramp table.

## Beatability

The test suite **plays** levels 1, 250, 500, 750 and 1000 with a brute-force
placement planner (best rotation + column for every piece) and asserts each one
reaches `levelclear` — that is, no level is a wall the player cannot pass.
