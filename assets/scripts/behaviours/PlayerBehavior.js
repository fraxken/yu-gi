// Import dependencies
import * as PIXI from "pixi.js";
import ScriptBehavior from "../ECS/scriptbehavior";
import { Key } from "../ECS/input.class";

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = 5) {
        super();

        this.speed = speed;
    }

    cameraInit() {
        console.log("camera initialized");
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
        if (game.input.isKeyDown(Key.Q)) {
            console.log("Q KEY!");
        }
        if (game.input.wasKeyJustPressed(Key.Z)) {
            console.log("Z KEY");
        }
        if (game.input.wasKeyJustReleased(Key.D)) {
            console.log("D KEY!");
            this.actor.moveX(this.speed);
        }

        this.actor.x += this.actor.vx;
        this.actor.y += this.actor.vy;

        this.actor.vx = 0;
        this.actor.vy = 0;
    }
}
