# ⚔️ Medieval Tetris — 1000 niveles

**Juego en vivo: [https://tetris-medieval.vercel.app](https://tetris-medieval.vercel.app)**

Un Tetris completo, sin dependencias, con **1000 niveles jugables**, de *muy fácil* a
*muy difícil*, envuelto en un mundo medieval: muros de piedra, bloques de gemas heráldicas,
fondos de castillo, luz de antorchas y rangos que van de **Paje** a **Leyenda**.

Creado con HTML5 canvas + JavaScript puro — sin paso de compilación, sin frameworks, sin
`npm install`. Se juega directamente desde `index.html` (incluso sobre `file://`) y
se despliega como sitio estático en Vercel.

![Medieval Tetris — nivel 563](docs/screenshot.png)

<p align="center">
  <a href="https://tetris-medieval.vercel.app"><strong>▶ Juega ya</strong></a> ·
  <a href="docs/LEVELS.md"><strong>Diseño de niveles</strong></a> ·
  <a href="docs/I18N.md"><strong>Traducciones</strong></a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a>
</p>

---

## Cómo ejecutarlo

**Opción A — simplemente haz doble clic en `index.html`** (funciona desde `file://`, sin servidor).

**Opción B — servidor local:**

```bash
npm start          # → http://localhost:8090
# or: node serve.js 8090
```

**Opción C — cualquier servidor estático** (`python -m http.server`, `npx serve`, …).

## Cómo jugar

| Control | Acción |
| --- | --- |
| `←` `→` / `A` `D` | Mover |
| `↓` / `S` | Caída suave |
| `↑` / `X` | Girar en sentido horario |
| `Z` / `Ctrl` | Girar en sentido antihorario |
| `Space` | Caída rápida |
| `C` / `Shift` | Reservar una pieza |
| `P` / `Esc` | Pausa · `M` Silenciar |
| Táctil | Pad en pantalla, o toca/arrastra sobre el tablero |

- Apila los tetrominós dentro del muro del castillo; una **fila completa de piedra se destruye**.
- Limpia la cantidad de líneas que pide el nivel → la puerta al siguiente nivel se abre.
- **Hold** mantiene una pieza en reserva hasta que la necesites; el **fantasma** indica dónde aterriza.

## Puntuación

| Acción | Puntos |
| --- | --- |
| Single / Double / Triple | 100 / 300 / 500 |
| **Tetris** (4 líneas) | **800** |
| T-Spin single / double | 400 / 1200 |
| Bono de seguidas (back-to-back) | ×1.5 |
| Combo (cada fila extra en una cadena) | +50 × combo |
| Caída suave / caída rápida | +1 / +2 por celda |
| Multiplicador de nivel | ×1.00 → ×3.00 al subir |

---

## Los 1000 niveles

- **100 mundos × 10 niveles**, agrupados en **10 rangos**: Paje → Escudero → Caballero →
  Barón → Vizconde → Conde → Duque → Rey → Emperador → **Leyenda**.
- Cada mundo tiene un nombre formado por su reino y su elemento
  (*Kingdom of Fire*, *Realm of Blood*, *Reich des Feuers*, *Reino de Fogo* …),
  un tema de color y uno de **6 fondos dibujados proceduralmente** (castillo, bosque,
  montañas, catedral, volcán, asedio a la luz de las estrellas).
- La dificultad `t = (n-1)/999` recorre de **0 → 1** todo el juego. El nivel 1 es un
  paseo; el nivel 1000 es despiadado:

| Ajuste | Nivel 1 | Nivel 250 | Nivel 500 | Nivel 750 | Nivel 1000 |
| --- | --- | --- | --- | --- | --- |
| Gravedad (ms/fila) | 1000 | 469 | 219 | 103 | **48** |
| Retardo de bloqueo | 900 ms | 520 ms | 300 ms | 173 ms | **100 ms** |
| Repetición de movimiento (DAS) | 170 ms | 132 ms | 103 ms | 80 ms | **62 ms** |
| Piezas en la vista previa | 5 | 5 | 4 | 3 | **1** |
| Filas de basura iniciales | 0 | 0 | 1 | 3 | **5** |
| Líneas por nivel | 4 | 6 | 9 | 11 | **14** |
| Multiplicador de puntuación | 1.00× | 1.50× | 2.00× | 2.50× | **3.00×** |

Además de eso:

- **Bolsa justa** (solo I J L O T) para los niveles 1–200; después, bolsa completa de 7 piezas.
- **Tormenta de basura** desde el nivel 751 en adelante: una nueva fila de piedra sube cada 14 s → cada 5 s.
- El **fantasma de aterrizaje desaparece en los últimos 100 niveles**.
- Los reinicios del bloqueo pasan de 15 → 8, de modo que los niveles tardíos castigan la indecisión.

Todo se **genera proceduralmente a partir del número de nivel**, así que el nivel 37 siempre
se ve y se juega igual, y no existe ningún archivo de datos de niveles que descargar.
Detalles completos en [docs/LEVELS.md](docs/LEVELS.md).

El **selector de niveles** recorre los 1000 niveles (25 / 50 / 100 por página), marca los
niveles que ya superaste y bloquea el resto — o activa *Desbloquear todos los niveles* en
Ajustes para explorar con libertad. El progreso, la mejor puntuación, el idioma y el sonido se guardan en
`localStorage`.

## 🌍 6 idiomas

English · Español · Français · Deutsch · Italiano · Português

Cambia de idioma en cualquier momento desde la barra superior (🌐) o desde Ajustes; la elección se
recuerda y el idioma del navegador se detecta en la primera visita. Todas las cadenas de la interfaz
viven en [`js/locales/`](js/locales) — 79 claves cada uno — junto con nombres de mundos y rangos
localizados y avisos de línea completada. Ver [docs/I18N.md](docs/I18N.md).

## 🧪 Pruebas

```bash
npm test
# 42 checks, runs in ~1 s
```

`test/levels.test.js` (Node puro, sin dependencias) verifica:

- que los **6 idiomas existen y comparten exactamente las mismas claves**, conservan cada `{placeholder}`,
  y traducen **todas** las claves de interfaz usadas por `index.html` y `main.js` — incluidas
  las etiquetas de los modificadores de nivel;
- que los **1000 niveles existen**, son **deterministas** y la escalada de dificultad es
  monótona (gravedad, retardo de bloqueo, DAS, ARR, vista previa, objetivos, multiplicador, basura);
- que el nivel 1 es verdaderamente fácil y el nivel 1000 verdaderamente difícil (aceleración de 20×);
- 100 mundos × 10 niveles, 10 rangos × 100 niveles, 100 nombres de mundo únicos por idioma;
- que las 7 tetrominós tienen 4 rotaciones × 4 celdas y tablas de correcciones SRS completas;
- una **simulación de juego real**: mover/girar/reservar/caída rápida funcionan, la gravedad bloquea
  las piezas por sí sola, se disparan los borrados de línea y la puntuación, los niveles 1/250/500/750/1000
  son todos superables, la basura es reproducible y la pausa congela el juego.

## 📁 Estructura del proyecto

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

## 🚀 Despliegue

El sitio está desplegado en **Vercel** en **https://tetris-medieval.vercel.app**.

```bash
vercel --prod        # static deploy, no build step
```

`.vercelignore` empaqueta solo los archivos del juego (docs y pruebas se quedan en el repo).
El código vive en GitHub: [`HarleyVasquezcom/Medieval-Tetris`](https://github.com/HarleyVasquezcom/Medieval-Tetris).

## Licencia

MIT — úsalo, haz un fork, enseña con él.
