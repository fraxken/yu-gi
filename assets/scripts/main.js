// Import Dependencies
import Actor from "./ECS/actor.class.js";
import Engine from "./ECS/engine.class.js";

// Import Behaviors
import PlayerBehavior from "./behaviours/PlayerBehavior.js";
// import CameraBehavior from "./behaviours/CameraBehavior.js";

// Import Assets
import adventurerAtlasURL from "../sprites/adventurer.json";

const game = new Engine()
    .registerAsset("adventurer", adventurerAtlasURL)
    .init();
window.game = game;

game.on("awake", () => {
    console.log("awake triggered!");
    const player = new Actor("player").addScriptedBehavior(new PlayerBehavior());

    // const camera = new Actor("camera", game.currentScene);
    // camera.addScriptedBehavior(new CameraBehavior());

    game.currentScene.add(player);
});
