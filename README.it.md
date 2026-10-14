# ⚔️ Medieval Tetris — 1000 Livelli

**Gioco online: [https://tetris-medieval.vercel.app](https://tetris-medieval.vercel.app)**

Un Tetris completo, senza dipendenze, con **1000 livelli giocabili**, da *molto facile* a
*molto difficile*, ambientato in un mondo medievale: muri di pietra, gemme araldiche,
sfondi di castelli, luce di torce e ranghi che vanno da **Paggio** a **Leggenda**.

Realizzato con semplice canvas HTML5 + JavaScript — nessun passaggio di build, nessun framework, nessun
`npm install`. Giocabile direttamente da `index.html` (anche via `file://`) e
pubblicato come sito statico su Vercel.

<p align="center">
  <a href="https://tetris-medieval.vercel.app"><strong>▶ Gioca ora</strong></a> ·
  <a href="docs/LEVELS.md"><strong>Progettazione dei livelli</strong></a> ·
  <a href="docs/I18N.md"><strong>Traduzioni</strong></a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a>
</p>

---

## Avviarlo

**Opzione A — basta fare doppio clic su `index.html`** (funziona da `file://`, senza server).

**Opzione B — server locale:**

```bash
npm start          # → http://localhost:8090
# or: node serve.js 8090
```

**Opzione C — qualsiasi server statico** (`python -m http.server`, `npx serve`, …).

## Come si gioca

| Comando | Azione |
| --- | --- |
| `←` `→` / `A` `D` | Muovi |
| `↓` / `S` | Caduta morbida |
| `↑` / `X` | Ruota in senso orario |
| `Z` / `Ctrl` | Ruota in senso antiorario |
| `Space` | Caduta rapida |
| `C` / `Shift` | Tieni un pezzo in riserva |
| `P` / `Esc` | Pausa · `M` Muto |
| Tocco | Tastiera a schermo, oppure tap/trascina sulla plancia |

- Impila i tetromino entro il muro del castello; una **riga di pietra completa viene distrutta**.
- Cancella il numero di righe richiesto dal livello → il cancello verso il livello successivo si apre.
- L'**hold** tiene un pezzo in riserva finché non ti serve; il **fantasma** mostra dove atterrerà.

## Punteggio

| Azione | Punti |
| --- | --- |
| Singola / Doppia / Tripla | 100 / 300 / 500 |
| **Tetris** (4 righe) | **800** |
| T-Spin singolo / doppio | 400 / 1200 |
| Bonus back-to-back | ×1.5 |
| Combo (ogni riga aggiuntiva in una catena) | +50 × combo |
| Caduta morbida / caduta rapida | +1 / +2 per cellula |
| Moltiplicatore di livello | ×1.00 → ×3.00 salendo |

---

## I 1000 livelli

- **100 mondi × 10 livelli**, divisi in **10 ranghi**: Paggio → Scudiero → Cavaliere →
  Barone → Visconte → Conte → Duca → Re → Imperatore → **Leggenda**.
- Ogni mondo ha un nome costruito dal suo regno e dal suo elemento
  (*Regno di Fuoco*, *Regno di Sangue*, *Reich des Feuers*, *Reino de Fogo* …),
  una palette cromatica e uno degli **6 sfondi generati proceduralmente** (castello, foresta,
  montagne, cattedrale, vulcano, assedio stellato).
- La difficoltà `t = (n-1)/999` va da **0 → 1** in tutto il gioco. Il livello 1 è una
  passeggiata; il livello 1000 è spietato:

| Parametro | Livello 1 | Livello 250 | Livello 500 | Livello 750 | Livello 1000 |
| --- | --- | --- | --- | --- | --- |
| Gravità (ms/riga) | 1000 | 469 | 219 | 103 | **48** |
| Ritardo di blocco | 900 ms | 520 ms | 300 ms | 173 ms | **100 ms** |
| Ripetizione movimento (DAS) | 170 ms | 132 ms | 103 ms | 80 ms | **62 ms** |
| Pezzi in anteprima | 5 | 5 | 4 | 3 | **1** |
| Righe garbage iniziali | 0 | 0 | 1 | 3 | **5** |
| Righe per livello | 4 | 6 | 9 | 11 | **14** |
| Moltiplicatore di punteggio | 1.00× | 1.50× | 2.00× | 2.50× | **3.00×** |

Inoltre:

- **Sacchetto equo** (solo I J L O T) per i livelli 1–200, sacchetto completo di 7 pezzi in seguito.
- **Tempesta di garbage** dal livello 751 in poi: una nuova riga di pietra sale ogni 14 s → ogni 5 s.
- Il **fantasma di atterraggio sparisce negli ultimi 100 livelli**.
- I reset del lock scendono da 15 → 8, così i livelli finali puniscono l'indecisione.

Tutto viene **generato proceduralmente dal numero del livello**, così il livello 37 ha sempre
lo stesso aspetto e la stessa giocabilità, e non esiste alcun file di dati dei livelli da scaricare.
Dettagli completi in [docs/LEVELS.md](docs/LEVELS.md).

La pagina **Level Select** scorre tutti i 1000 livelli (25 / 50 / 100 per pagina), segna i
livelli che hai superato e blocca gli altri — oppure attiva *Unlock every level* in
Impostazioni per esplorare liberamente. Progressi, punteggio migliore, lingua e audio persistono in
`localStorage`.

## 🌍 6 lingue

English · Español · Français · Deutsch · Italiano · Português

Puoi cambiare in qualsiasi momento dalla barra superiore (🌐) o da Impostazioni; la scelta viene ricordata e
la lingua del browser viene rilevata alla prima visita. Tutte le stringhe dell'interfaccia vivono in
[`js/locales/`](js/locales) — 79 chiavi ciascuna — oltre ai nomi dei mondi, ai nomi dei
ranghi e agli annunci di cancellazione riga localizzati. Vedi [docs/I18N.md](docs/I18N.md).

## 🧪 Test

```bash
npm test
# 42 checks, runs in ~1 s
```

`test/levels.test.js` (puro Node, senza dipendenze) verifica:

- tutte le **6 localizzazioni esistono, condividono esattamente le stesse chiavi**, conservano ogni `{placeholder}`,
  e traducono **ogni** chiave dell'interfaccia usata da `index.html` e `main.js` — comprese
  le etichette dei modificatori di livello;
- tutti i **1000 livelli esistono**, sono **deterministici**, e la rampa di difficoltà è
  monotona (gravità, ritardo di blocco, DAS, ARR, anteprima, obiettivi, moltiplicatore, garbage);
- il livello 1 è davvero facile e il livello 1000 davvero difficile (velocità ×20);
- 100 mondi × 10 livelli, 10 ranghi × 100 livelli, 100 nomi di mondi unici per lingua;
- tutti e 7 i tetromino hanno 4 rotazioni × 4 celle e le tabelle di kick SRS complete;
- una **vera simulazione di gioco**: movimento/rotazione/hold/caduta rapida funzionano, la gravità blocca
  i pezzi da sola, cancellazioni riga e punteggio scattano, i livelli 1/250/500/750/1000 sono
  tutti superabili, il garbage è riproducibile e la pausa congela il gioco.

## 📁 Struttura del progetto

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

## 🚀 Pubblicazione

Il sito è pubblicato su **Vercel** all'indirizzo **https://tetris-medieval.vercel.app**.

```bash
vercel --prod        # static deploy, no build step
```

`.vercelignore` include solo i file di gioco (docs e test restano nel repository).
Il codice sorgente è su GitHub: [`HarleyVasquezcom/Medieval-Tetris`](https://github.com/HarleyVasquezcom/Medieval-Tetris).

## Licenza

MIT — usalo, forka, insegnalo.
