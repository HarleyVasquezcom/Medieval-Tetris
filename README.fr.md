# ⚔️ Medieval Tetris — 1000 niveaux

**Jeu en ligne : [https://tetris-medieval.vercel.app](https://tetris-medieval.vercel.app)**

Un Tetris complet, sans aucune dépendance, avec **1000 niveaux jouables**, du *très facile* au
*très difficile*, plongé dans un monde médiéval : murs de pierre, blocs de gemmes héraldiques,
châteaux en fond, lumière des torches et grades allant de **Page** à **Légende**.

Réalisé en HTML5 canvas + JavaScript brut — sans build, sans framework, sans
`npm install`. Jouable directement depuis `index.html` (même en `file://`) et
déployé en site statique sur Vercel.

<p align="center">
  <a href="https://tetris-medieval.vercel.app"><strong>▶ Jouer maintenant</strong></a> ·
  <a href="docs/LEVELS.md"><strong>Conception des niveaux</strong></a> ·
  <a href="docs/I18N.md"><strong>Traductions</strong></a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a>
</p>

---

## Lancer le jeu

**Option A — double-cliquez simplement sur `index.html`** (fonctionne en `file://`, sans serveur).

**Option B — serveur local :**

```bash
npm start          # → http://localhost:8090
# or: node serve.js 8090
```

**Option C — n'importe quel serveur statique** (`python -m http.server`, `npx serve`, …).

## Comment jouer

| Commande | Action |
| --- | --- |
| `←` `→` / `A` `D` | Déplacer |
| `↓` / `S` | Descente douce |
| `↑` / `X` | Rotation horaire |
| `Z` / `Ctrl` | Rotation antihoraire |
| `Space` | Descente rapide |
| `C` / `Shift` | Mettre une pièce en réserve |
| `P` / `Esc` | Pause · `M` Couper le son |
| Tactile | Pavé à l'écran, ou appui/glissement sur le plateau |

- Empilez les tétraominos dans le mur du château ; une **ligne de pierre complète est détruite**.
- Effacez le nombre de lignes demandé par le niveau → la porte du niveau suivant s'ouvre.
- La **réserve** garde une pièce jusqu'à ce que vous en ayez besoin ; le **fantôme** montre où elle atterrit.

## Score

| Action | Points |
| --- | --- |
| Simple / Double / Triple | 100 / 300 / 500 |
| **Tetris** (4 lignes) | **800** |
| T-Spin simple / double | 400 / 1200 |
| Bonus consécutif (back-to-back) | ×1.5 |
| Combo (chaque ligne en plus dans une chaîne) | +50 × combo |
| Descente douce / descente rapide | +1 / +2 par case |
| Multiplicateur de niveau | ×1.00 → ×3.00 en montant |

---

## Les 1000 niveaux

- **100 mondes × 10 niveaux**, regroupés en **10 grades** : Page → Écuyer → Chevalier →
  Baron → Vicomte → Comte → Duc → Roi → Empereur → **Légende**.
- Chaque monde porte un nom construit à partir de son royaume et de son élément
  (*Royaume de Feu*, *Royaume de Sang*, *Reich des Feuers*, *Reino de Fogo* …),
  un thème de couleurs et l'un des **6 décors dessinés procéduralement** (château, forêt,
  montagnes, cathédrale, volcan, siège sous les étoiles).
- La difficulté `t = (n-1)/999` progresse de **0 → 1** sur tout le jeu. Le niveau 1 est une
  promenade ; le niveau 1000 est sans pitié :

| Réglage | Niveau 1 | Niveau 250 | Niveau 500 | Niveau 750 | Niveau 1000 |
| --- | --- | --- | --- | --- | --- |
| Gravité (ms/ligne) | 1000 | 469 | 219 | 103 | **48** |
| Délai de verrouillage | 900 ms | 520 ms | 300 ms | 173 ms | **100 ms** |
| Répétition de déplacement (DAS) | 170 ms | 132 ms | 103 ms | 80 ms | **62 ms** |
| Pièces en aperçu | 5 | 5 | 4 | 3 | **1** |
| Lignes de déchets au départ | 0 | 0 | 1 | 3 | **5** |
| Lignes par niveau | 4 | 6 | 9 | 11 | **14** |
| Multiplicateur de score | 1.00× | 1.50× | 2.00× | 2.50× | **3.00×** |

En plus de cela :

- **Sac équilibré** (I J L O T uniquement) pour les niveaux 1–200, puis sac complet de 7 pièces.
- **Tempête de déchets** à partir du niveau 751 : une nouvelle ligne de pierre monte toutes les 14 s → toutes les 5 s.
- Le **fantôme d'atterrissage disparaît pour les 100 derniers niveaux**.
- Les réinitialisations de verrouillage passent de 15 → 8 : la fin de partie punit l'indécision.

Tout est **généré procéduralement à partir du numéro du niveau** : le niveau 37 a
toujours exactement le même aspect et le même ressenti, et il n'y a aucun fichier de
données de niveau à télécharger. Détails complets dans [docs/LEVELS.md](docs/LEVELS.md).

**La sélection de niveau** parcourt les 1000 niveaux (25 / 50 / 100 par page), indique
les niveaux que vous avez battus et verrouille les autres — ou activez *Déverrouiller
tous les niveaux* dans les réglages pour explorer librement. Progression, meilleur
score, langue et son sont conservés dans `localStorage`.

## 🌍 6 langues

English · Español · Français · Deutsch · Italiano · Português

Changez à tout moment depuis la barre supérieure (🌐) ou les réglages ; votre
choix est mémorisé et la langue du navigateur est détectée à la première visite.
Toutes les chaînes d'interface se trouvent dans
[`js/locales/`](js/locales) — 79 clés chacune — ainsi que les noms de mondes,
de grades et les annonces de lignes traduits. Voir [docs/I18N.md](docs/I18N.md).

## 🧪 Tests

```bash
npm test
# 42 checks, runs in ~1 s
```

`test/levels.test.js` (Node simple, sans dépendance) vérifie :

- que les **6 locales existent et partagent exactement les mêmes clés**, conservent
  chaque `{placeholder}` et traduisent **chaque** clé d'interface utilisée par
  `index.html` et `main.js` — y compris les libellés des modificateurs de niveau ;
- que les **1000 niveaux existent**, sont **déterministes** et que la difficulté
  progresse de façon monotone (gravité, délai de verrouillage, DAS, ARR, aperçu,
  objectifs, multiplicateur, déchets) ;
- que le niveau 1 est vraiment facile et le niveau 1000 vraiment difficile (accélération ×20) ;
- 100 mondes × 10 niveaux, 10 grades × 100 niveaux, 100 noms de mondes uniques par langue ;
- que les 7 tétraominos ont 4 rotations × 4 cases et des tables de wall-kick SRS complètes ;
- une **vraie simulation de partie** : déplacement, rotation, réserve et descente
  rapide fonctionnent, la gravité verrouille les pièces toute seule, l'effacement
  des lignes et le score se déclenchent, les niveaux 1/250/500/750/1000 sont
  tous gagnables, les déchets sont reproductibles et la pause fige le jeu.

## 📁 Structure du projet

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

## 🚀 Déploiement

Le site est déployé sur **Vercel** à l'adresse **https://tetris-medieval.vercel.app**.

```bash
vercel --prod        # static deploy, no build step
```

`.vercelignore` n'expédie que les fichiers du jeu (docs et tests restent dans le dépôt).
Le code source est sur GitHub : [`HarleyVasquezcom/Medieval-Tetris`](https://github.com/HarleyVasquezcom/Medieval-Tetris).

## Licence

MIT — utilisez-le, forkez-le, enseignez avec.
