// Import third-party Dependencies
import { filters } from "@pixi/sound";
import * as PIXI from "pixi.js";
// import FontFaceObserver from "fontfaceobserver";
window.PIXI = PIXI;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RESOLUTION = 2;
PIXI.settings.PRECISION_FRAGMENT = "highp";

// Import ECS & Helpers Dependencies
import { State, Engine } from "./ECS";
import { BackgroundMediaPlayer, Key } from "./helpers";

// Import Behaviors and Scenes
import "./behaviours";
import { DungeonScene, DefaultScene } from "./scenes";

import assetsURL from "../assets.json";

async function main() {
    const gameState = new State("gameState", {
        player: {
            name: "Thomas",
            currentHp: 1,
            maxHp: 15
        }
    });

    const game = new Engine({ defaultScene: DefaultScene, state: gameState })
        .loadAssetFromFile(assetsURL)
        // .registerTileSet("TilesetFloorB")
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
}
main().catch(console.error);

// document.addEventListener("DOMContentLoaded", () => {
//     const font = new FontFaceObserver("Roboto");
//     font.load().then(main).catch(console.error);
// });
