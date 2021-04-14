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
    speed: 0.8,
    currentHp: 1,
    maxHp: 20
}
const kDefaultVelocityScallFrames = 240;

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = defaultStats.speed, currentHp = defaultStats.currentHp, maxHp = defaultStats.maxHp) {
        super(playerState);

        this.currentKey = null;
        this.hasMovedPreviously = false;
        this.speed = speed;
        this.maxSpeed = 2.5;
        this.currentHp = currentHp;
        this.maxHp = maxHp;
        this.time = new Timer(60);
        this.velocityScallTimer = new Timer(kDefaultVelocityScallFrames, { autoStart: false, keepIterating: false });
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

        if (
            this.actor.moving &&
            this.hasMovedPreviously
        ) {
            if (this.speed !== this.maxSpeed) {
                if (!this.velocityScallTimer.isStarted) {
                    this.velocityScallTimer.start();
                }

                if (!this.velocityScallTimer.walk()) {
                    const t = EasingFunction.easeInOutQuad(this.velocityScallTimer.tick, 0, 1, kDefaultVelocityScallFrames);

                    const dx = this.maxSpeed - defaultStats.speed;
                    this.speed = defaultStats.speed + dx * t;
                }
            }
        }
        else {
            this.speed = defaultStats.speed;
            this.velocityScallTimer.reset();
        }

        this.hasMovedPreviously = this.actor.moving ? true : false;

        if (game.input.isKeyDown(Key.E)) {
            this.sprite.playAnimation("adventurer-die", { loop: false });
            if (!this.deathSound.isPlaying) {
                this.deathSound.play();
            }
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
