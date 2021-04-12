// Import Dependencies
import Engine from "./ECS/engine.class.js";
import State from "./ECS/state.class";
import * as Behaviors from "./behaviours/all";

import DefaultScene from "../scenes/default";

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
    .init();

game.on("awake", () => {
    loadHUD("test_hud");
});
