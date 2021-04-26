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

const DEFAULT_HEALTH_REGENERATION = 1;
const DEFAULT_SPEED_BOOST = 0;
const DEFAULT_DAMAGE = 2.5;
const DEFAULT_DEFENSE = 0;
export default class PlayerBehavior extends ScriptBehavior {
    constructor(speed = kPlayerStats.speed, currentHp = kPlayerStats.currentHp, maxHp = kPlayerStats.maxHp) {
        super({
            currentHp: "player.currentHp",
            maxHp: "player.maxHp",
            playable: "playable",
            spawnActorName: "spawnActorName"
        });

        this.inRangeEnemies = new Set();
        this.maxHp = maxHp;
        this.damage = DEFAULT_DAMAGE;
        this.defense = DEFAULT_DEFENSE;
        this.isTeleporting = new Timer(10, { autoStart: false, keepIterating: false });
        this.dashTimer = new Timer(40, { autoStart: false, keepIterating: false });
        this.jumpTimer = new Timer(110, { autoStart: false, keepIterating: false });
        this.attackTimer = new Timer(110, { autoStart: false, keepIterating: false });
        this.randomAttack = null;
        this.time = new Timer(60 * 5);
        this.dieScreen = null;
        this.damageContainer = new Set();
        this.healthRegeneration = DEFAULT_HEALTH_REGENERATION;
        this.speedBoost = DEFAULT_SPEED_BOOST;

        this.speed = new ProgressiveNumber(speed, speed * 2, {
            easing: "easeInQuad", frame: 90
        });

        this.cardDeck = new Deck();
    }

    inRange(actorName) {
        if (!this.inRangeEnemies.has(actorName)) {
            this.inRangeEnemies.add(actorName);
        }

        return this;
    }

    outRange(actorName) {
        if (this.inRangeEnemies.has(actorName)) {
            this.inRangeEnemies.delete(actorName);
        }

        return this;
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

    takeDamage(damage, { isCritical = false } = {}) {
        if (typeof damage !== "number" || (damage - this.defense) < 0) {
            damage = 0;
        }

        damage -= this.defense;

        if (this.currentHp - damage <= 0) {
            this.currentHp = 0;
            this.die();
        }
        else {
            this.currentHp -= damage;
        }

        const dmg = new DamageText(damage, this.actor, {
            isCritical
        });
        dmg.once("done", () => this.damageContainer.delete(dmg));
        this.damageContainer.add(dmg);

        return this;
    }

    canAttack() {
        if (!this.attackTimer.isStarted) {
            this.attackTimer.start();
            this.randomAttack = Math.floor(Math.random() * 3) + 1;

            return true;
        }

        if (!this.attackTimer.walk()) {
            return false;
        }

        if (this.attackTimer.walk()) {
            this.attackTimer.reset();
        }

        return false;
    }

    dealsDamage() {
        this.inRangeEnemies.forEach((enemy) => {
            const actor = getActor(enemy);
            const isLookingToRight = this.sprite.scale.x === 1 ? true : false;

            let canBeHit;
            if (isLookingToRight) {
                canBeHit = this.actor.x < actor.x ? true : false;
            }
            else {
                canBeHit = this.actor.x > actor.x ? true : false;
            }

            const isCritical = Math.random() < 0.05;
            const damageToApply = isCritical ? this.damage * 2 : this.damage;

            if (canBeHit) {
                if (actor.behaviors.some((behavior) => behavior.constructor.name.startsWith("Melee"))) {
                    actor.getScriptedBehavior("MeleeBehavior").sendMessage("takeDamage", damageToApply, { isCritical });
                }
                else if (actor.behaviors.some((behavior) => behavior.constructor.name.startsWith("Caster"))) {
                    actor.getScriptedBehavior("CasterBehavior").sendMessage("takeDamage", damageToApply, { isCritical });
                }
                else if (actor.behaviors.some((behavior) => behavior.constructor.name.startsWith("Boss"))) {
                    actor.getScriptedBehavior("BossBehavior").sendMessage("takeDamage", damageToApply, { isCritical });
                }
            }
        });
    }

    die(cause = "no-pv") {
        this.playable = false;
        this.sprite.playAnimation("adventurer-die", { loop: false });
        if (!this.gameOverSound.isPlaying) {
            this.gameOverSound.play();
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
                this.currentHp = 1;
                this.playable = true;
                this.dieScreen = null;
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
        }

        this.gameOverSound = sound.find("gameover");
        this.gameOverSound.volume = 0.1;
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

        this.cardDeck.loadState();
    }

    computeMovement() {
        const neighbours = this.collision.getNeighBourWalkable(this.actor.x, this.actor.y);
        const isLeftWalkable = !neighbours.left || neighbours.right;
        const isRightWalkable = !neighbours.right || neighbours.left;
        const isTopWalkable = !neighbours.top || neighbours.bottom;
        const isBottomWalkable = !neighbours.bottom || neighbours.top;

        const currentSpeed = this.speed.walk(!this.actor.moving) + this.speedBoost;
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

        this.jump();
    }

    jump() {
        if (Inputs.jump() && !this.jumpTimer.isStarted && (Inputs.right() || Inputs.left()) && (!Inputs.down() && !Inputs.up())) {
            this.jumpTimer.start();
        }
    }

    computeAnimations() {
        if (this.attackTimer.isStarted && !this.attackTimer.walk()) {
            this.sprite.playAnimation(`adventurer-attack${this.randomAttack}`);
        }
        else if (this.dashTimer.isStarted && !this.dashTimer.walk()) {
            this.sprite.playAnimation(this.actor.moving ? "adventurer-slide" : "idle");
        }
        else if (this.jumpTimer.isStarted && !this.jumpTimer.walk()) {
            this.sprite.playAnimation("adventurer-jump");
        }
        else {
            this.dashTimer.reset();
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "idle");
        }
    }

    computeSkills() {
        if (Inputs.offensive()) {
            this.cardDeck.useOffensiveSkill();
        }
        else if (Inputs.defensive()) {
            this.cardDeck.useDefensiveSkill();
        }
        else if (Inputs.consumable()) {
            this.cardDeck.useConsumable();
        }
        else if (Inputs.refresh()) {
            this.cardDeck.carouselSlot();
        }
    }

    computeDeck() {
        if (Inputs.openDeck()) {
            window.hudevents.emit('deck', true);
        }

        if (Inputs.escape()) {
            window.hudevents.emit('deck', false);
        }
    }

    update() {
        game.fade.centerPosition = this.actor.pos;
        if (this.dieScreen !== null) {
            this.dieScreen.update();
        }
        if (!this.playable) {
            return;
        }
        // Timer to avoid double teleportation bug
        if (this.isTeleporting.isStarted) {
            this.isTeleporting.walk();
        }

        // Update damage text
        for (const dmg of this.damageContainer) {
            dmg.update();
        }

        // TODO: remove this later
        if (this.time.walk() && this.currentHp < this.maxHp) {
            this.addHealth(this.healthRegeneration);
        }

        this.computeMovement();
        if (Inputs.offensive() && this.canAttack()) {
            this.dealsDamage();
        }

        this.computeAnimations();
        this.computeSkills();
        this.computeDeck();

        this.actor.applyVelocity();
    }

    addHealth(amount) {
        if ((this.currentHp + amount) <= this.maxHp) {
            this.currentHp += amount;
        } else {
            this.currentHp += (this.maxHp - this.currentHp);
        }
    }

    offensiveSkill(aMessage) {
        console.log("attack", aMessage);
    }

    defensiveSkill(aMessage) {
        console.log("defend", aMessage);
    }

    consumable(name, value) {
        console.log("consume", name, value);
        switch (name) {
            case "healthUp":
                this.addHealth(value);
                break;

            default:
                break;
        }
    }

    activatePassive(passiveName, value) {
        switch (passiveName) {
            case "healthRegenBoost":
                this.healthRegeneration = value;
                break;
            case "speedBoost":
                this.speedBoost = value;
                break;
            case "attackDamageBoost":
                this.damage += value;
                break;
            case "defenseBoost":
                this.defense = value;
                break;
            case "elementaryDamage":
                break;
            default:
                break;
        }
    }

    deactivatePassive(passiveName) {
        switch (passiveName) {
            case "healthRegenBoost":
                this.healthRegeneration = DEFAULT_HEALTH_REGENERATION;
                break;
            case "speedBoost":
                this.speedBoost = DEFAULT_SPEED_BOOST;
                break;
            case "attackDamageBoost":
                this.damage = DEFAULT_DAMAGE;
                break;
            case "defenseBoost":
                this.defense = DEFAULT_DEFENSE;
                break;
            case "elementaryDamage":
                break;
            default:
                break;
        }
    }

    recuperator() {
        this.cardDeck.updateRecuperator();
    }
}

ScriptBehavior.define("PlayerBehavior", PlayerBehavior);

EntityBuilder.define("actor:player", () => {
    return new Actor("player")
        .createScriptedBehavior("PlayerBehavior");
});
