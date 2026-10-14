# ⚔️ Medieval Tetris — 1000 Levels

**Jogo ao vivo: [https://tetris-medieval.vercel.app](https://tetris-medieval.vercel.app)**

Um Tetris completo, sem dependências, com **1000 níveis jogáveis**, de *muito fácil* a
*muito difícil*, ambientado em um mundo medieval: paredes de pedra, blocos de gema
heráldicos, castelos ao fundo, luz de tochas e patentes que vão de **Page** a **Legend**.

Feito com HTML5 canvas puro + JavaScript — sem etapa de build, sem framework, sem
`npm install`. Jogável direto do `index.html` (inclusive via `file://`) e
publicado como site estático na Vercel.

![Medieval Tetris — nível 563](docs/screenshot.png)

<p align="center">
  <a href="https://tetris-medieval.vercel.app"><strong>▶ Jogar agora</strong></a> ·
  <a href="docs/LEVELS.md"><strong>Design dos níveis</strong></a> ·
  <a href="docs/I18N.md"><strong>Traduções</strong></a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a>
</p>

---

## Como executar

**Opção A — basta dar dois cliques em `index.html`** (funciona via `file://`, sem servidor).

**Opção B — servidor local:**

```bash
npm start          # → http://localhost:8090
# or: node serve.js 8090
```

**Opção C — qualquer servidor estático** (`python -m http.server`, `npx serve`, …).

## Como jogar

| Controle | Ação |
| --- | --- |
| `←` `→` / `A` `D` | Mover |
| `↓` / `S` | Queda suave |
| `↑` / `X` | Girar no sentido horário |
| `Z` / `Ctrl` | Girar no sentido anti-horário |
| `Space` | Queda rápida |
| `C` / `Shift` | Guardar uma peça |
| `P` / `Esc` | Pausar · `M` Silenciar |
| Toque | Teclado na tela, ou toque/arraste no tabuleiro |

- Empilhe os tetrominós dentro do muro do castelo; uma **linha completa de pedra é destruída**.
- Limpe o número de linhas pedido pelo nível → o portão para o próximo nível se abre.
- **Hold** mantém uma peça em reserva até você precisar dela; o **fantasma** mostra onde ela cai.

## Pontuação

| Ação | Pontos |
| --- | --- |
| Single / Double / Triple | 100 / 300 / 500 |
| **Tetris** (4 linhas) | **800** |
| T-Spin single / double | 400 / 1200 |
| Bônus back-to-back | ×1.5 |
| Combo (cada linha extra em uma cadeia) | +50 × combo |
| Queda suave / queda rápida | +1 / +2 por célula |
| Multiplicador de nível | ×1.00 → ×3.00 conforme você sobe |

---

## Os 1000 níveis

- **100 mundos × 10 níveis**, agrupados em **10 patentes**: Page → Squire → Knight →
  Baron → Viscount → Count → Duke → King → Emperor → **Legend**.
- Cada mundo tem um nome criado a partir do seu reino e do seu elemento
  (*Kingdom of Fire*, *Realm of Blood*, *Reich des Feuers*, *Reino de Fogo* …),
  um tema de cor e um dos **6 cenários de fundo desenhados proceduralmente** (castelo, floresta,
  montanhas, catedral, vulcão, cerco sob as estrelas).
- A dificuldade `t = (n-1)/999` vai de **0 → 1** ao longo de todo o jogo. O nível 1 é um
  passeio; o nível 1000 é impiedoso:

| Ajuste | Nível 1 | Nível 250 | Nível 500 | Nível 750 | Nível 1000 |
| --- | --- | --- | --- | --- | --- |
| Gravidade (ms/linha) | 1000 | 469 | 219 | 103 | **48** |
| Delay de encaixe | 900 ms | 520 ms | 300 ms | 173 ms | **100 ms** |
| Repetição de movimento (DAS) | 170 ms | 132 ms | 103 ms | 80 ms | **62 ms** |
| Peças na prévia | 5 | 5 | 4 | 3 | **1** |
| Linhas de lixo iniciais | 0 | 0 | 1 | 3 | **5** |
| Linhas por nível | 4 | 6 | 9 | 11 | **14** |
| Multiplicador de pontuação | 1.00× | 1.50× | 2.00× | 2.50× | **3.00×** |

Além disso:

- **Bolsa justa** (apenas I J L O T) nos níveis 1–200, bolsa completa de 7 peças depois.
- **Tempestade de lixo** a partir do nível 751: uma nova linha de pedra sobe a cada 14 s → a cada 5 s.
- O **fantasma de pouso desaparece nos últimos 100 níveis**.
- Os reinícios de encaixe caem de 15 → 8, para que os níveis finais punam a indecisão.

Tudo é **gerado proceduralmente a partir do número do nível**, de modo que o nível 37 sempre
parece e funciona exatamente igual, e não existe arquivo de dados de níveis para baixar.
Detalhes completos em [docs/LEVELS.md](docs/LEVELS.md).

A tela **Level Select** percorre todos os 1000 níveis (25 / 50 / 100 por página), marca os
níveis que você já venceu e bloqueia os demais — ou ative *Unlock every level* em
Settings para explorar livremente. Progresso, melhor pontuação, idioma e som persistem no
`localStorage`.

## 🌍 6 idiomas

English · Español · Français · Deutsch · Italiano · Português

Troque a qualquer momento pela barra superior (🌐) ou em Settings; a escolha fica gravada e
o idioma do navegador é detectado na primeira visita. Todas as strings da UI estão em
[`js/locales/`](js/locales) — 79 chaves cada — além de nomes de mundos localizados, nomes de
patentes e avisos de limpeza de linhas. Veja [docs/I18N.md](docs/I18N.md).

## 🧪 Testes

```bash
npm test
# 42 checks, runs in ~1 s
```

`test/levels.test.js` (Node puro, sem dependências) verifica que:

- todas as **6 localizações existem, compartilham exatamente as mesmas chaves**, mantêm todo `{placeholder}`,
  e traduzem **todas** as chaves de UI usadas por `index.html` e `main.js` — incluindo
  os rótulos dos modificadores de nível;
- os **1000 níveis existem**, são **determinísticos**, e a rampa de dificuldade é
  monótona (gravidade, delay de encaixe, DAS, ARR, prévia, objetivos, multiplicador, lixo);
- o nível 1 é realmente fácil e o nível 1000 realmente difícil (20× de aceleração);
- 100 mundos × 10 níveis, 10 patentes × 100 níveis, 100 nomes de mundos únicos por idioma;
- os 7 tetrominós têm 4 rotações × 4 células e tabelas de kick completas do SRS;
- uma **simulação real de partida**: mover/girar/guardar/queda-rápida funcionam, a gravidade encaixa
  as peças sozinha, limpezas de linha e pontuação disparam, os níveis 1/250/500/750/1000 são
  todos vencíveis, o lixo é reprodutível e a pausa congela o jogo.

## 📁 Estrutura do projeto

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

## 🚀 Publicação

O site é publicado na **Vercel** em **https://tetris-medieval.vercel.app**.

```bash
vercel --prod        # static deploy, no build step
```

O `.vercelignore` envia apenas os arquivos do jogo (docs e testes ficam no repositório).
O código está no GitHub: [`HarleyVasquezcom/Medieval-Tetris`](https://github.com/HarleyVasquezcom/Medieval-Tetris).

## Licença

MIT — use, faça fork, ensine com ele.
