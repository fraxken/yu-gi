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
            game.getAtlasTexture("adventurer", "adventurer-idle-00.png")
        );
        this.actor.addSprite(asset);

        // character.y = (app.stage.height / 2) - (character.height / 2);
        // character.x = (app.stage.width / 2) - (character.width / 2);
    }

    update() {
        if (game.input.isKeyDown("KeyD")) {
            console.log("execute!!!");
            this.actor.moveX(this.speed);
        }

        this.actor.x += this.actor.vx;
        this.actor.y += this.actor.vy;

        this.actor.vx = 0;
        this.actor.vy = 0;
    }
}
