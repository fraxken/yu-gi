// Import third-party dependencies
import { sound } from "@pixi/sound";
import * as PIXI from "pixi.js";

// Import dependencies
import { Actor, ScriptBehavior, Components, Timer, ProgressiveNumber, getActor } from "../ECS";
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import CollisionLayer from "../ECS/components/collisionLayer.class";
import { EntityBuilder, Key, LifeBar } from "../helpers";
import { Button } from "../helpers/input.class";
import DieScreen from "../helpers/DieScreen";
import DamageText from "../helpers/DamageText";
import { Deck } from "../helpers/Deck/Deck";

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
            playable: "playable",
            spawnActorName: "spawnActorName"
        });

        this.maxHp = maxHp;
        this.isTeleporting = new Timer(10, { autoStart: false, keepIterating: false });
        this.dashTimer = new Timer(40, { autoStart: false, keepIterating: false });
        this.jumpTimer = new Timer(110, { autoStart: false, keepIterating: false });
        this.time = new Timer(60 * 5);
        this.dieScreen = null;
        this.damageContainer = new Set();

        this.speed = new ProgressiveNumber(speed, speed * 2, {
            easing: "easeInQuad", frame: 90
        });

        this.cardDeck = new Deck();
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

    fastTeleport(position) {
        if (this.isTeleporting.isStarted) {
            return;
        }
        this.isTeleporting.start();
        this.actor.pos = position;
    }

    enterDungeon(roomId = 1, niveauId = 1) {
        this.playable = false;
        this.sprite.playAnimation("idle");

        game.loadScene("dungeon", roomId, niveauId);
    }

    exitDungeon(failure = true) {
        this.playable = false;
        this.sprite.playAnimation("idle");

        game.rootScene.exitDungeon(failure);
    }

    takeDamage(damage) {
        this.currentHp -= damage;
        const dmg = new DamageText(damage, this.actor, { isCritical: Math.random() > 0.5 });
        dmg.once("done", () => this.damageContainer.delete(dmg));
        this.damageContainer.add(dmg);

        return this;
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
        game.fade.out(() => {
            const centerPosition = this.spawn.centerPosition;
            game.fade.centerPosition = centerPosition;
            this.actor.pos = centerPosition;
            game.viewport.moveCenter(this.actor.x, this.actor.y);

            this.dieScreen = new DieScreen();
            this.dieScreen.once("cleanup", () => {
                this.playable = true;
                this.dieScreen = null;
                this.currentHp = 1;
                game.fade.in();
            });
            this.dieScreen.zIndex = 31;
            this.dieScreen.position.set(centerPosition.x, centerPosition.y);
            game.rootScene.addChild(this.dieScreen);
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
            this.spawn = map.findChild(this.spawnActorName, true);
            if (this.spawn) {
                this.actor.pos = this.spawn.centerPosition;
            }
            if (this.spawnActorName !== "spawn") {
                this.spawnActorName = "spawn";
            }

            /** @type {CollisionLayer} */
            this.collision = map.getComponent(Components.Types.TiledMap).collision;
        }

        game.viewport.moveCenter(this.actor.x, this.actor.y);
        game.viewport.follow(this.actor, {
            speed: 3,
            acceleration: 0.016,
            radius: 40,
        });

        this.cardDeck.loadIntoHUD();
    }

    update() {
        game.fade.centerPosition = this.actor.pos;

        if (this.dieScreen !== null) {
            this.dieScreen.update();
        }
        if (!this.playable) {
            return;
        }
        if (this.isTeleporting.isStarted) {
            this.isTeleporting.walk();
        }

        for (const dmg of this.damageContainer) {
            dmg.update();
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

        if (!this.dashTimer.isStarted && Inputs.left() && Inputs.dash() && isLeftDashable) {
            this.actor.moveX(-dashSpeed);
            this.sprite.scale.x = -1;
            this.dashTimer.start();
        }
        else if (Inputs.left() && isLeftWalkable) {
            this.actor.moveX(-currentSpeed);
            this.sprite.scale.x = -1;
        }

        if (!this.dashTimer.isStarted && Inputs.right() && Inputs.dash() && isRightDashable) {
            this.actor.moveX(dashSpeed);
            this.sprite.scale.x = -1;
            this.dashTimer.start();
        }
        else if (Inputs.right() && isRightWalkable) {
            this.actor.moveX(currentSpeed);
            this.sprite.scale.x = 1;
        }

        if (!this.dashTimer.isStarted && Inputs.up() && Inputs.dash() && isTopDashable) {
            this.actor.moveY(-dashSpeed);
            this.dashTimer.start();
        }
        else if (Inputs.up() && isTopWalkable) {
            this.actor.moveY(-currentSpeed);
        }

        if (!this.dashTimer.isStarted && Inputs.down() && Inputs.dash() && isBottomDashable) {
            this.actor.moveY(dashSpeed);
            this.dashTimer.start();
        }
        else if (Inputs.down() && isBottomWalkable) {
            this.actor.moveY(currentSpeed);
        }

        if (Inputs.jump() && !this.jumpTimer.isStarted && (Inputs.right() || Inputs.left()) && (!Inputs.down() && !Inputs.up())) {
            this.jumpTimer.start();
        }

        if (game.input.wasKeyJustPressed(Key.L) || game.input.wasGamepadButtonJustPressed(Button.SELECT) || this.currentHp === 0) {
            this.die();
        }

        if (this.dashTimer.isStarted && !this.dashTimer.walk()) {
            this.sprite.playAnimation(this.actor.moving ? "adventurer-slide" : "idle");
        } else if (this.jumpTimer.isStarted && !this.jumpTimer.walk()) {
            this.sprite.playAnimation("adventurer-jump");
        } else {
            this.dashTimer.reset();
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "idle");
        }

        if (game.input.wasKeyJustPressed(Key._1)) {
            this.cardDeck.useOffensiveSkill();
        } else if (game.input.wasKeyJustPressed(Key._2)) {
            this.cardDeck.useDefensiveSkill();
        } else if (game.input.wasKeyJustPressed(Key._3)) {
            this.cardDeck.useConsumable();
        } else if (game.input.wasKeyJustPressed(Key.X)) {
            this.cardDeck.carouselSlot();
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
