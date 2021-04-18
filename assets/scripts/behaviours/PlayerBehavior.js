// Import third-party dependencies
import { sound } from "@pixi/sound";

// Import dependencies
import { Actor, ScriptBehavior, Components, Timer, ProgressiveNumber, getActor } from "../ECS";
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import CollisionLayer from "../ECS/components/collisionLayer.class";
import { EntityBuilder, Key } from "../helpers";

const kPlayerStats = {
    speed: 1,
    currentHp: 1,
    maxHp: 20
}

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = kPlayerStats.speed, currentHp = kPlayerStats.currentHp, maxHp = kPlayerStats.maxHp) {
        super({
            currentHp: "player.currentHp",
            maxHp: "player.maxHp"
        });

        this.currentHp = currentHp;
        this.maxHp = maxHp;
        this.playable = true;

        this.time = new Timer(60);
        this.speed = new ProgressiveNumber(speed, speed * 2, {
            easing: "easeInQuad", frame: 90
        });
    }

    teleport(position) {
        console.log("player teleport at: ", position);
        this.playable = false;

        game.fade.auto(() => {
            this.actor.pos = position;
            game.viewport.moveCenter(this.actor.x, this.actor.y);
            this.playable = true;
        });
    }

    awake() {
        {
            const spriteComponent = new Components.AnimatedSpriteEx("adventurer", {
                defaultAnimation: "adventurer-idle"
            });
            spriteComponent.oneToMany("idle", ["adventurer-idle", "adventurer-idle-2"]);

            /** @type {AnimatedSpriteEx} */
            this.sprite = this.actor.addComponent(spriteComponent);
        }

        const map = getActor("map");
        const spawn = map.findChild("spawn", true);
        this.actor.pos = spawn.centerPosition;

        game.viewport.moveCenter(this.actor.x, this.actor.y);
        game.viewport.follow(this.actor, {
            speed: 1.5,
            acceleration: 0.01,
            radius: 40,
        });

        this.deathSound = sound.find("death");
        this.deathSound.volume = 0.1;

        /** @type {CollisionLayer} */
        this.collision = map.getComponent(Components.Types.TiledMap).collision;
    }

    update() {
        game.fade.displayObject.position.set(
            this.actor.x - window.innerWidth / 2,
            this.actor.y - window.innerHeight / 2
        );

        if (!this.playable) {
            return;
        }
        if (this.time.walk() && this.currentHp < this.maxHp) {
            this.currentHp += 1;
        }

        // console.log(this.collision.isWalkable(this.actor.x, this.actor.y));

        const currentSpeed = this.speed.walk(!this.actor.moving);
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

        if (game.input.isKeyDown(Key.L)) {
            this.sprite.playAnimation("adventurer-die", { loop: false });
            // this.sprite.lock();
            if (!this.deathSound.isPlaying) {
                this.deathSound.play();
            }
        }

        this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "idle");
        this.actor.applyVelocity();
    }
}

ScriptBehavior.define("PlayerBehavior", PlayerBehavior);

EntityBuilder.define("actor:player", () => {
    return new Actor("player")
        .createScriptedBehavior("PlayerBehavior");
});
