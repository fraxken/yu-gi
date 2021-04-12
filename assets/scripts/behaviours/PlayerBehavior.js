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
    constructor(speed = 0.4, currentHp = 1, maxHp = 20) {
        super();

        this.count = 1;
        this.currentKey = null;
        this.previousKey = null;
        this.speed = speed;
        this.maxSpeed = 2;
        this.currentHp = currentHp;
        this.maxHp = maxHp;
        this.time = new Timer(60);
        this.speedDelay = new Timer(120);

        this.stateConfiguration(PlayerState);
    }

    awake() {
        this.actor.addSprite(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );

        game.viewport.moveCenter(this.actor.x, this.actor.y);
        game.viewport.follow(this.actor, {
            speed: 1,
            acceleration: 0.01,
            radius: 40
        });
    }

    update() {
        this.currentKey = null;
        if (this.time.walk() && this.currentHp < this.maxHp) {
            this.currentHp += 1;
        }

        if (game.input.isKeyDown(Key.Q)) {
            this.currentKey = Key.Q;
            this.actor.moveX(-this.speed);
            this.sprite.scale.x = -1;
        }
        else if (game.input.isKeyDown(Key.D)) {
            this.currentKey = Key.D;
            this.actor.moveX(this.speed);
            this.sprite.scale.x = 1;
        }

        if (game.input.isKeyDown(Key.Z)) {
            this.currentKey = Key.Z;
            this.actor.moveY(-this.speed);
        }
        else if (game.input.isKeyDown(Key.S)) {
            this.currentKey = Key.S;
            this.actor.moveY(this.speed);
        }

        if (
            (this.currentKey === Key.S ||
            this.currentKey === Key.Z ||
            this.currentKey === Key.D ||
            this.currentKey === Key.Q) &&
            (this.previousKey === Key.S ||
            this.previousKey === Key.Z ||
            this.previousKey === Key.D ||
            this.previousKey === Key.Q)
            ) {
            if (this.speedDelay.walk()) {
                this.count +=1;
                this.speed *= this.count;
                if (this.speed > this.maxSpeed) {
                    this.speed = this.maxSpeed;
                }
            }
            else {
                this.speed = this.speed;
            }
        }
        else {
            this.speed = 0.8;
            this.count = 1;
            this.previousKey = null;
        }

        if (game.input.isKeyDown(Key.Q)) {
            this.previousKey = Key.Q;
            this.actor.moveX(-this.speed);
            this.sprite.scale.x = -1;
        }
        else if (game.input.isKeyDown(Key.D)) {
            this.previousKey = Key.D;
            this.actor.moveX(this.speed);
            this.sprite.scale.x = 1;
        }

        if (game.input.isKeyDown(Key.Z)) {
            this.previousKey = Key.Z;
            this.actor.moveY(-this.speed);
        }
        else if (game.input.isKeyDown(Key.S)) {
            this.previousKey = Key.S;
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
