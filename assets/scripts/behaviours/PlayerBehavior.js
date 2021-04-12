// Import dependencies
import Actor from "../ECS/actor.class";
import ScriptBehavior from "../ECS/scriptbehavior";
import AnimatedSpriteEx from "../ECS/animatedsprite.class";

import Timer from "../helpers/timer.class";
import * as EntityBuilder from "../helpers/entitybuilder.js";
import { Key } from "../helpers/input.class";

const PlayerState = {
    currentHp: "player.currentHp",
    maxHp: "player.maxHp"
};

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = 2.5, currentHp = 1, maxHp = 20) {
        super();

        this.speed = speed;
        this.currentHp = currentHp;
        this.maxHp = maxHp;
        this.time = new Timer(60);

        this.stateConfiguration(PlayerState);
    }

    cameraInit() {
        console.log("camera initialized");
    }

    awake() {
        this.actor.addSprite(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );

        console.log("sprite width: ", this.sprite.width);
        console.log("sprite height: ", this.sprite.height);

        // this.actor.y = (game.app.stage.height / 2) - (this.actor.sprite.height / 2);
        // this.actor.x = (game.app.stage.width / 2) - (this.actor.sprite.width / 2);

        game.viewport.follow(this.actor, {
            speed: 1,
            acceleration: 0.01,
            radius: 40
        });
    }

    update() {
        if (this.time.walk() && this.currentHp < this.maxHp) {
            this.currentHp += 1;
        }

        if (game.input.isKeyDown(Key.Q)) {
            this.actor.moveX(-this.speed);
            this.sprite.scale.x = -1;
        }
        else if (game.input.isKeyDown(Key.D)) {
            this.actor.moveX(this.speed);
            this.sprite.scale.x = 1;
        }

        if (game.input.isKeyDown(Key.Z)) {
            this.actor.moveY(-this.speed);
        }
        else if (game.input.isKeyDown(Key.S)) {
            this.actor.moveY(this.speed);
        }

        if (game.input.isKeyDown(Key.E)) {
            this.sprite.playAnimation("adventurer-die", { loop: false })
        } else {
            this.sprite.playAnimation(this.hasVelocity ? "adventurer-run" : "adventurer-idle");
        }
    }
}

EntityBuilder.define("actor:player", () => {
    return new Actor("player")
        .addScriptedBehavior(new PlayerBehavior());
});
