# Ludum-dare 48

A top-down Roguelike game where you have to manage a deck of cards with multiple effects to explore, fight and survive. Made in 72h for [Ludum dare 48](https://ldjam.com/) with the theme **deeper and deeper**.

WARNING: The game is not finished !!!.

> This game require **WebGL** (it use [Pixi.js](https://www.pixijs.com/) under the hood).

## Game

### Story

The player starts in a village where a very strange monument exists. It looks like a teleportation portal but from an ancient time.
Recently, it has been activated and you have been sent there to make a report, because it seems that since "this activation" monsters are prowling around the village and all the people who entered the portal have disappeared.

### Controls

- **W/A/S/D** or **LEFT/RIGHT/UP/DOWN** to move.
- **E** to interact.
- **C** for dash.
- **M** to open minimap in the dungeon.

Cards:
- **&** or **NUM_1** (use offensive card to attack)
- **é** or **NUM_2** (use defensive card)
- **"** or **NUM_3** (use consumable card)
- **X** or **ENTER** (re-roll cards in the deck)

### Credits

Art by
- VENNET Adrien
- Raph

Programming by
- GENTILHOMME Thomas
- LIONNET Cédric
- LEPATELEY Quentin
- HALLAERT Nicolas
- GOREZ Tony

The free assets we use:
- (Minimap icons) https://quintino-pixels.itch.io/free-pixel-art-skill-icons-pack
- (UI) https://hyohnoo.itch.io/keyboard-controller-keys
- (Background Music) https://vgcomposer.itch.io/action-rpg-music-free
- (TileSet) https://pixel-boy.itch.io/ninja-adventure-asset-pack

---

## Build

### Required

- [Node.js](https://nodejs.org/en/) v14 or higher (with the ability to compile native addons).
- [GIT](https://git-scm.com/).

### Getting started

```
git clone https://github.com/fraxken/pixi-experimental.git
cd pixi-experimental
npm ci
npm start
```

If you want an auto-restart:
```
npm run watch
```

### Scripts

The command `npm run asset:cleanup` will cleanup TiledMap and TiledSet .json assets. The command must be run each time of the asset is updated.


### Note
We use the root directory docs/ to build the static web page (for the game). The real doc is /wiki.
