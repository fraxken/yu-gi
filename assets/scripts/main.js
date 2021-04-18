// Import third-party Dependencies
import { filters } from "@pixi/sound";
import * as PIXI from "pixi.js";
window.PIXI = PIXI;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// Import Dependencies
import { State, Engine } from "./ECS";
import { BackgroundMediaPlayer, Key } from "./helpers";
import * as Behaviors from "./behaviours";

import DefaultScene from "./scenes/default";

Behaviors.init();

const gameState = new State("gameState", {
    player: {
        name: "Thomas",
        currentHp: 1,
        maxHp: 15
    }
});

const game = new Engine({ defaultScene: DefaultScene, state: gameState })
    .registerTileSet("TilesetElement")
    .registerTileSet("TilesetFloor")
    .registerTileSet("TilesetHouse")
    .registerTileSet("TilesetNature")
    .registerTileSet("TilesetDungeon")
    // .registerTileSet("TilesetFloorB")
    // .registerTileSet("TilesetFloorDetail")
    // .registerTileSet("TilesetHole")
    // .registerTileSet("TilesetInterior")
    // .registerTileSet("TilesetInteriorFloor")
    .registerTileSet("TilesetLogic")
    // .registerTileSet("TilesetRelief")
    // .registerTileSet("TilesetReliefDetail")
    // .registerTileSet("TilesetWater")
    .registerAsset("map1", "tilemaps/test.json")
    .registerAsset("adventurer", "sprites/adventurer.json")
    .registerAsset("ambient-sound", "sounds/back-ambient-sound.mp3")
    .registerAsset("ambient-void", "sounds/back-ambient-void.ogg")
    .registerAsset("death", "sounds/death.wav")
    .init();

// new BackgroundMediaPlayer({
//     defaultTrack: "default",
//     defaultFilters: [
//         new filters.DistortionFilter(0.05),
//         new filters.ReverbFilter(1, 9)
//     ],
//     tracks: {
//         default: [
//             { name: "ambient-sound", volume: 0.025 },
//             { name: "ambient-void", volume: 0.025 }
//         ]
//     }
// }).bindToEngine(game);

game.on("awake", () => {
    loadHUD("test_hud");
});

// game.on("update", () => {
//     if (game.input.wasKeyJustPressed(Key.ENTER)) {
//         console.log("ENTER");
//     }
// });
