// Import dependencies
import { Actor, ScriptBehavior, AnimatedSpriteEx } from "../ECS";
import { Timer, EntityBuilder, Key } from "../helpers";

const PlayerState = {
    currentHp: "player.currentHp",
    maxHp: "player.maxHp"
};

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = 2.5, currentHp = 1, maxHp = 20) {
        super(PlayerState);

        this.speed = speed;
        this.currentHp = currentHp;
        this.maxHp = maxHp;
        this.time = new Timer(60);
    }

    awake() {
        this.sprite = this.actor.addComponent(
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
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-idle");
        }

        this.actor.applyVelocity();
    }
}

ScriptBehavior.define("PlayerBehavior", PlayerBehavior);

EntityBuilder.define("actor:player", () => {
    return new Actor("player")
        .createScriptedBehavior("PlayerBehavior");
});
