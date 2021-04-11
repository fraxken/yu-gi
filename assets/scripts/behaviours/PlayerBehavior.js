// Import dependencies
import * as PIXI from "pixi.js";

import Actor from "../ECS/actor.class";
import ScriptBehavior from "../ECS/scriptbehavior";
import Timer from "../helpers/timer.class";

import { Key } from "../helpers/input.class";
import * as EntityBuilder from "../helpers/entitybuilder.js";
import { getSpritesheet } from "../ECS/helpers";

const PlayerState = {
    hp: "player.hp"
};

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = 2.5) {
        super();

        this.speed = speed;
        this.hp = 1;
        this.time = new Timer(120);

        this.stateConfiguration(PlayerState);
    }

    cameraInit() {
        console.log("camera initialized");
    }

    getCharacterAnimation(name) {
        const playerSpritesheet = getSpritesheet("adventurer");

        return playerSpritesheet.animations[name];
    }

    updateCharacterAnimation(animationName) {
        this.actor.sprite.stop();

        this.currentAnimation = animationName;
        this.actor.sprite.textures = this.getCharacterAnimation(animationName);

        this.actor.sprite.animationSpeed = 0.1;
        this.actor.sprite.play();
    }

    awake() {
        this.currentAnimation = "adventurer-idle";
        const animatedSprite = new PIXI.AnimatedSprite(this.getCharacterAnimation(this.currentAnimation));
        animatedSprite.animationSpeed = 0.1;
        animatedSprite.play();
        this.actor.addSprite(animatedSprite);

        console.log("sprite width: ", this.actor.sprite.width);
        console.log("sprite height: ", this.actor.sprite.height);
        this.actor.sprite.anchor.set(0.5, 0.5);

        // this.actor.y = (game.app.stage.height / 2) - (this.actor.sprite.height / 2);
        // this.actor.x = (game.app.stage.width / 2) - (this.actor.sprite.width / 2);

        game.viewport.follow(this.actor, {
            speed: 1,
            acceleration: 0.01,
            radius: 40
        });
    }

    update() {
        if (this.time.walk()) {
            this.hp += 1;
        }

        let isMoving = false;
        if (game.input.isKeyDown(Key.Q)) {
            this.actor.moveX(-this.speed);
            isMoving = true;

            this.actor.sprite.scale.x = -1;
        }
        else if (game.input.isKeyDown(Key.D)) {
            this.actor.moveX(this.speed);
            isMoving = true;

            this.actor.sprite.scale.x = 1;
        }

        if (game.input.isKeyDown(Key.Z)) {
            this.actor.moveY(-this.speed);
            isMoving = true;
        }
        else if (game.input.isKeyDown(Key.S)) {
            this.actor.moveY(this.speed);
            isMoving = true;
        }

        if (isMoving && this.currentAnimation !== "adventurer-run") {
            this.updateCharacterAnimation("adventurer-run");
        }
        else if (!isMoving && this.currentAnimation !== "adventurer-idle") {
            this.updateCharacterAnimation("adventurer-idle");
        }
    }
}

EntityBuilder.define("actor:player", () => {
    return new Actor("player")
        .addScriptedBehavior(new PlayerBehavior());
});
