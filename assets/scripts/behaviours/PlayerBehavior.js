// Import third-party dependencies
import { sound } from "@pixi/sound";
import * as PIXI from "pixi.js";

// Import dependencies
import { Actor, ScriptBehavior, Components, Timer, ProgressiveNumber, getActor } from "../ECS";
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import CollisionLayer from "../ECS/components/collisionLayer.class";
import { EntityBuilder, Key, LifeBar } from "../helpers";
import { Button } from "../helpers/input.class";

import { Inputs } from "../keys";

const kPlayerStats = {
    speed: 1,
    currentHp: 1,
    maxHp: 20
}

export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = kPlayerStats.speed, currentHp = kPlayerStats.currentHp, maxHp = kPlayerStats.maxHp) {
        super({
            currentHp: "player.currentHp",
            maxHp: "player.maxHp",
            playable: "playable"
        });

        this.currentHp = currentHp;
        this.maxHp = maxHp;
        this.dashTimer = new Timer(40, { autoStart: false, keepIterating: false });
        this.jumpTimer = new Timer(120, { autoStart: false, keepIterating: false});
        this.staticJumpTimer = new Timer(90, { autoStart: false, keepIterating: false});
        this.time = new Timer(60);

        this.speed = new ProgressiveNumber(speed, speed * 2, {
            easing: "easeInQuad", frame: 90
        });
    }

    teleport(position) {
        console.log("player teleport at: ", position);
        this.playable = false;
        this.sprite.playAnimation("idle");

        game.fade.auto(() => {
            game.fade.centerPosition = position;

            this.actor.pos = position;
            game.viewport.moveCenter(this.actor.x, this.actor.y);
            this.playable = true;
        });
    }

    enterDungeon() {
        this.playable = false;
        this.sprite.playAnimation("idle");

        game.loadScene("dungeon");
    }

    die(cause = "no-pv") {
        this.playable = false;
        this.sprite.playAnimation("adventurer-die", { loop: false });
        if (!this.deathSound.isPlaying) {
            this.deathSound.play();
        }

        if (this.actor.isInDungeon) {
            game.loadScene("default");

            return;
        }
        game.fade.auto(() => {
            game.fade.centerPosition = this.spawn.centerPosition;

            this.actor.pos = this.spawn.centerPosition;
            game.viewport.moveCenter(this.actor.x, this.actor.y);
            this.playable = true;
        });
    }

    awake() {
        this.playable = true;
        {
            const spriteComponent = new Components.AnimatedSpriteEx("adventurer", {
                defaultAnimation: "adventurer-idle"
            });
            spriteComponent.anchor.set(0.5, 1);
            spriteComponent.oneToMany("idle", ["adventurer-idle", "adventurer-idle-2"]);

            /** @type {AnimatedSpriteEx} */
            this.sprite = this.actor.addComponent(spriteComponent);

            this.lifeBar = new LifeBar({
                spriteHeight: this.sprite.height,
                currentHp: this.currentHp,
                relativeMaxHp: this.maxHp,
                maxHpBarLength: 60
            });

            this.actor.addChild(this.lifeBar.container);
        }

        this.deathSound = sound.find("death");
        this.deathSound.volume = 0.1;
    }

    start() {
        const map = getActor("map") || getActor("start_room");
        if (map) {
            this.spawn = map.findChild("spawn", true);
            if (this.spawn) {
                this.actor.pos = this.spawn.centerPosition;
            }

            /** @type {CollisionLayer} */
            this.collision = map.getComponent(Components.Types.TiledMap).collision;
        }

        game.viewport.moveCenter(this.actor.x, this.actor.y);
        game.viewport.follow(this.actor, {
            speed: 1.5,
            acceleration: 0.01,
            radius: 40,
        });
    }

    update() {
        game.fade.centerPosition = this.actor.pos;

        if (!this.playable) {
            return;
        }
        if (this.time.walk() && this.currentHp < this.maxHp) {
            this.currentHp += 1;
        }

        const neighbours = this.collision.getNeighBourWalkable(this.actor.x, this.actor.y);
        const isLeftWalkable = !neighbours.left || neighbours.right;
        const isRightWalkable = !neighbours.right || neighbours.left;
        const isTopWalkable = !neighbours.top || neighbours.bottom;
        const isBottomWalkable = !neighbours.bottom || neighbours.top;


        const currentSpeed = this.speed.walk(!this.actor.moving);
        const dashSpeed = currentSpeed * 3;
        const neighboursForCustomRange = this.collision.getNeighBourWalkableForGivenRange(this.actor.x, this.actor.y, (currentSpeed * 2));

        const isLeftDashable = !neighboursForCustomRange.left || neighboursForCustomRange.right;
        const isRightDashable = !neighboursForCustomRange.right || neighboursForCustomRange.left;
        const isTopDashable = !neighboursForCustomRange.top || neighboursForCustomRange.bottom;
        const isBottomDashable = !neighboursForCustomRange.bottom || neighboursForCustomRange.top;

        if (!this.dashTimer.isStarted && Inputs.left() && game.input.wasKeyJustPressed(Key.C) && isLeftDashable) {
            this.actor.moveX(-dashSpeed);
            this.sprite.scale.x = -1;
            this.dashTimer.start();
        }
        else if (Inputs.left() && isLeftWalkable) {
            this.actor.moveX(-currentSpeed);
            this.sprite.scale.x = -1;
        }

        if (!this.dashTimer.isStarted && Inputs.right() && game.input.wasKeyJustPressed(Key.C) && isRightDashable) {
            this.actor.moveX(dashSpeed);
            this.sprite.scale.x = -1;
            this.dashTimer.start();
        }
        else if (Inputs.right() && isRightWalkable) {
            this.actor.moveX(currentSpeed);
            this.sprite.scale.x = 1;
        }

        if (!this.dashTimer.isStarted && Inputs.up() && game.input.wasKeyJustPressed(Key.C) && isTopDashable) {
            this.actor.moveY(-dashSpeed);
            this.dashTimer.start();
        }
        else if (Inputs.up() && isTopWalkable) {
            this.actor.moveY(-currentSpeed);
        }

        if (!this.dashTimer.isStarted && Inputs.down() && game.input.wasKeyJustPressed(Key.C) && isBottomDashable) {
            this.actor.moveY(dashSpeed);
            this.dashTimer.start();
        }
        else if (Inputs.down() && isBottomWalkable) {
            this.actor.moveY(currentSpeed);
        }

        if (game.input.wasKeyJustPressed(Key.SPACE) && !this.jumpTimer.isStarted) {
            this.actor.moving ? this.jumpTimer.start() : this.staticJumpTimer.start();
        }

        if (game.input.wasKeyJustPressed(Key.L) || game.input.wasGamepadButtonJustPressed(Button.SELECT)) {
            this.die();
        }

        if (this.dashTimer.isStarted && !this.dashTimer.walk()) {
            this.sprite.playAnimation(this.actor.moving ? "adventurer-slide" : "idle");
        } else if ((this.jumpTimer.isStarted && !this.jumpTimer.walk()) || (this.staticJumpTimer.isStarted && !this.staticJumpTimer.walk())) {
            this.sprite.playAnimation(this.actor.moving ? "adventurer-jump" : "adventurer-smrslt");
        } else {
            this.dashTimer.reset();
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "idle");
        }
        this.lifeBar.update(this.currentHp);
        this.actor.applyVelocity();
    }
}

ScriptBehavior.define("PlayerBehavior", PlayerBehavior);

EntityBuilder.define("actor:player", () => {
    return new Actor("player")
        .createScriptedBehavior("PlayerBehavior");
});
