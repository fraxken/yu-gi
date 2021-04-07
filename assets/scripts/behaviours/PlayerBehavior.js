// Import dependencies
import * as PIXI from "pixi.js";
import ScriptBehavior from "../ECS/scriptbehavior";

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = 5) {
        super();

        this.speed = speed;
    }

    awake() {
        const asset = new PIXI.Sprite(
            game.getAtlasTexture(adventurerAtlasURL, "adventurer-idle-00.png")
        );
        this.actor.addSprite(asset);

        // character.y = (app.stage.height / 2) - (character.height / 2);
        // character.x = (app.stage.width / 2) - (character.width / 2);
    }

    update() {
        if (game.input.isKeyDown("KeyD")) {
            this.actor.moveX(this.speed);
        }
    }
}
