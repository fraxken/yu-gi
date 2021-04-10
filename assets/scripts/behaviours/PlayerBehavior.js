// Import dependencies
import * as PIXI from "pixi.js";

import Actor from "../ECS/actor.class";
import ScriptBehavior from "../ECS/scriptbehavior";
import Timer from "../helpers/timer.class";

import { Key } from "../helpers/input.class";
import * as EntityBuilder from "../helpers/entitybuilder.js";
import { getAtlasTexture } from "../ECS/helpers";

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = 5) {
        super();

        this.speed = speed;
        this.hp = 1;
        this.time = new Timer(120);
    }

    cameraInit() {
        console.log("camera initialized");
    }

    awake() {
        const asset = new PIXI.Sprite(
            getAtlasTexture("adventurer", "adventurer-idle-00.png")
        );
        this.actor.addSprite(asset);

        // this.actor.y = (game.app.stage.height / 2) - (this.actor.sprite.height / 2);
        // this.actor.x = (game.app.stage.width / 2) - (this.actor.sprite.width / 2);
    }

    update() {
        if (this.time.walk()) {
            this.updateProperty("hp", ++this.hp);
        }

        if (game.input.isKeyDown(Key.Q)) {
            this.actor.moveX(-this.speed);
        }
        else if (game.input.isKeyDown(Key.D)) {
            this.actor.moveX(this.speed);
        }

        if (game.input.isKeyDown(Key.Z)) {
            this.actor.moveY(-this.speed);
        }
        else if (game.input.isKeyDown(Key.S)) {
            this.actor.moveY(this.speed);
        }
    }
}

EntityBuilder.define("actor:player", () => {
    return new Actor("player")
        .addScriptedBehavior(new PlayerBehavior());
});
