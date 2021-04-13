// Import third-party Dependencies
import { sound, filters } from "@pixi/sound";

// Import Dependencies
import { State, Engine } from "./ECS";
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

game.on("awake", () => {
    loadHUD("test_hud");
    const ambientSound = sound.find("ambient-void");
    ambientSound.volume = 0.05;
    ambientSound.filters = [
        new filters.DistortionFilter(0.05),
        new filters.ReverbFilter(1, 9)
    ];

    ambientSound.play();
});
