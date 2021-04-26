// Import third-party Dependencies
import { filters } from "@pixi/sound";
const PIXI = require("pixi.js");

window.PIXI = PIXI;
window.hudevents = new PIXI.utils.EventEmitter();

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RESOLUTION = 2;
PIXI.settings.PRECISION_FRAGMENT = "highp";
PIXI.settings.SORTABLE_CHILDREN = true;

require("pixi-layers");

// import FontFaceObserver from "fontfaceobserver";

// Import ECS & Helpers Dependencies
import { State, Engine } from "./ECS";
import { BackgroundMediaPlayer } from "./helpers";

// Import Behaviors and Scenes
import "./behaviours";
import { DungeonScene, DefaultScene } from "./scenes";

import assetsURL from "../assets.json";

async function main() {
    const gameState = new State("gameState", {
        spawnActorName: "spawn",
        playable: true,
        stoneEnabled: false,
        dungeon: {
            enabled: false,
            progression: "1.1"
        },
        player: {
            gold: 1000,
            currentHp: 100,
            maxHp: 150
        },
        deck: {
            slotHUD: {},
            discard: [],
            draw: [],
            lockedCard: [],
            recuperator: [],
        }
    });

    gameState.reset();

    const game = new Engine({ defaultScene: DungeonScene, state: gameState })
        .loadAssetFromFile(assetsURL)
        .init();

    window.mediaplayer = new BackgroundMediaPlayer({
        defaultTrack: "town",
        defaultFilters: [
            new filters.DistortionFilter(0.05),
            new filters.ReverbFilter(1, 9)
        ],
        tracks: {
            town: [
                { name: "town0", volume: 0.010 },
                { name: "town1", volume: 0.010 }
            ],
            donjon: [
                { name: "donjon1", volume: 0.010 },
                { name: "donjon2", volume: 0.010 },
                { name: "donjon3", volume: 0.010 }
            ],
            battle: [
                { name: "battle", volume: 0.010 }
            ],
            house: [
                { name: "house", volume: 0.010 }
            ]
        }
    }).bindToEngine(game);

    game.on("awake", () => {
        loadHUD("test_hud");
    });
}
main().catch(console.error);

// document.addEventListener("DOMContentLoaded", () => {
//     const font = new FontFaceObserver("Roboto");
//     font.load().then(main).catch(console.error);
// });
