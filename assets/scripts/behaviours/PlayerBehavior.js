// Import third-party dependencies
import { sound } from "@pixi/sound";

// Import dependencies
import { Actor, ScriptBehavior, Components } from "../ECS";
import { Timer, EntityBuilder, EasingFunction, Key } from "../helpers";

const playerState = {
    currentHp: "player.currentHp",
    maxHp: "player.maxHp"
};
const defaultStats = {
    speed: 1,
    currentHp: 1,
    maxHp: 20
}

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = defaultStats.speed, currentHp = defaultStats.currentHp, maxHp = defaultStats.maxHp) {
        super(playerState);

        this.defaultSpeed = speed;
        this.maxSpeed = speed * 2;
        this.currentHp = currentHp;
        this.maxHp = maxHp;

        this.time = new Timer(60);
        this.speedTimer = new Timer(90, {
            autoStart: true, keepIterating: false
        });
    }

    awake() {
        this.sprite = this.actor.addComponent(
            new Components.AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );

        game.viewport.moveCenter(this.actor.x, this.actor.y);
        game.viewport.follow(this.actor, {
            speed: 1,
            acceleration: 0.01,
            radius: 40
        });

        this.deathSound = sound.find("death");
        this.deathSound.volume = 0.1;
    }

    update() {
        if (this.time.walk() && this.currentHp < this.maxHp) {
            this.currentHp += 1;
        }

        let currentSpeed = this.defaultSpeed;
        if (this.actor.moving && this.speedTimer.upTick()) {
            const progression = this.speedTimer.progression("easeInQuad");
            const dx = this.maxSpeed - this.defaultSpeed;

            currentSpeed = this.defaultSpeed + dx * progression;
        }
        else {
            this.speedTimer.reset();
        }

        if (game.input.isKeyDown(Key.Q)) {
            this.actor.moveX(-currentSpeed);
            this.sprite.scale.x = -1;
        }
        else if (game.input.isKeyDown(Key.D)) {
            this.actor.moveX(currentSpeed);
            this.sprite.scale.x = 1;
        }

        if (game.input.isKeyDown(Key.Z)) {
            this.actor.moveY(-currentSpeed);
        }
        else if (game.input.isKeyDown(Key.S)) {
            this.actor.moveY(currentSpeed);
        }

        if (game.input.isKeyDown(Key.E)) {
            this.sprite.playAnimation("adventurer-die", { loop: false });
            if (!this.deathSound.isPlaying) {
                this.deathSound.play();
            }
        }
        else {
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
