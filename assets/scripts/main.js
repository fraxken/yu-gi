// Import third-party Dependencies
import { filters } from "@pixi/sound";

// Import Dependencies
import { State, Engine } from "./ECS";
import { BackgroundMediaPlayer } from "./helpers";
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
    .registerAsset("adventurer", "sprites/adventurer.json")
    .registerAsset("ambient-sound", "sounds/back-ambient-sound.mp3")
    .registerAsset("ambient-void", "sounds/back-ambient-void.ogg")
    .registerAsset("death", "sounds/death.wav")
    .init();

new BackgroundMediaPlayer({
    defaultTrack: "default",
    defaultFilters: [
        new filters.DistortionFilter(0.05),
        new filters.ReverbFilter(1, 9)
    ],
    tracks: {
        default: [
            { name: "ambient-sound", volume: 0.025 },
            { name: "ambient-void", volume: 0.025 }
        ]
    }
}).bindToEngine(game);

game.on("awake", () => {
    loadHUD("test_hud");
});
