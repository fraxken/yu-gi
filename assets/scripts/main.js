// Import Dependencies
import Actor from "./ECS/actor.class.js";
import Engine from "./ECS/engine.class.js";

// Import Behaviors
import PlayerBehavior from "./behaviours/PlayerBehavior.js";

// Import Assets
import adventurerAtlasURL from "../sprites/adventurer.json";

const game = new Engine()
    .registerAsset(adventurerAtlasURL)
    .init();
window.game = game;

game.on("awake", () => {
    const player = new Actor("player");
    player.addScriptedBehavior(new PlayerBehavior());

    game.currentScene.add(player);
});
