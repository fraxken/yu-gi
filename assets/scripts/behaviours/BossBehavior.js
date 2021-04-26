import { sound } from "@pixi/sound";

// Import dependencies
import { ScriptBehavior, getActor, Timer, Components, Vector2 } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import { Inputs } from "../keys";
import * as EntityBuilder from "../helpers/entitybuilder.js";

// CONSTS
const kHandicapBetweenDeplacement = 360;

const kHandicapBetweenMeleeAttack = 160;
const kHandicapForMeleeAttack = 110;

const kHandicapBetweenDistAttack = 240;
const kHandicapForDistAttack = 110;

const kHandicapBetweenSpecialAttack = 300;
const kHandicapForSpecialAttack = 110;

const kDelayToDie = 160;

export default class BossBehavior extends ScriptBehavior {
    constructor() {
        super();

        // Default stats
        this.deplacementAreaRadius = 30;
        this.deplacementMaxAreaRadius = 320;
        this.targetingRangeForMelee = 120;
        this.attackingRangeForMelee = 20;
        this.meleeDamage = 2;
        this.minRangeForDist = 120;
        this.attackingRangeForDist = 200;
        this.rangedDamage = 1;
        this.attackingRangeForSpecialAttack = 60;
        this.specialAttackDamage = 4;
        this.currentHp = 10;
        this.maxHp = 10;
        this.currentSpeed = 0.8;

        // Deplacements
        this.isMoving = false;
        this.nextPos = { x: null, y: null };
        this.delayToMove = new Timer(kHandicapBetweenDeplacement,  { keepIterating: false });

        this.isAttacking = false;
        // Melee Attack
        this.delayBeforeNextMeleeAttack = new Timer(kHandicapBetweenMeleeAttack, { autoStart: false, keepIterating: false });
        this.timerForCurrentMeleeAttack = new Timer(kHandicapForMeleeAttack, { autoStart: false, keepIterating: false });

        // Dist Attack
        this.delayBeforeNextDistAttack = new Timer(kHandicapBetweenDistAttack, { autoStart: false, keepIterating: false });
        this.timerForCurrentDistAttack = new Timer(kHandicapForDistAttack, { autoStart: false, keepIterating: false });

        // Special Attack
        this.delayBeforeNextSpecialAttack = new Timer(kHandicapBetweenSpecialAttack, { autoStart: false, keepIterating: false });
        this.timerForCurrentSpecialAttack = new Timer(kHandicapForSpecialAttack, { autoStart: false, keepIterating: false });

        this.isDead = false;
        this.timerForDying = new Timer(kDelayToDie, { autoStart: false, keepIterating: false });

        this.teleporting = false;
        this.rageMode = false;
        this.time = new Timer(60 * 5);
        this.damageContainer = new Set();
    }

    awake() {
        this.sprite = this.actor.addComponent(
            new Components.AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );

        this.lifeBar = new LifeBar({
            spriteHeight: this.sprite.height,
            currentHp: this.currentHp,
            relativeMaxHp: this.maxHp,
            maxHpBarLength: 60
        });

        this.anchor = new Vector2(this.actor.x, this.actor.y);

        this.actor.addChild(this.lifeBar.container);
    }

    start() {
        this.target = getActor("player");

        this.winSound = sound.find("win");
        this.winSound.volume = 0.1;
    }

    warp() {
        this.teleporting = true;

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        script.sendMessage("exitDungeon", false);
    }

    canBeAttacked() {
        const isInsideRangeOfPlayer = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= 40 * 40;

        if (isInsideRangeOfPlayer) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("inRange", this.actor.name);
        }
        else {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);
        }
    }

    takeDamage(damage, { isCritical = false } = {}) {
        if (typeof damage !== "number") {
            damage = 0;
        }

        if (this.currentHp - damage <= 0) {
            this.currentHp = 0;
        }

        this.currentHp -= damage;

        if (this.currentHp <= (40 * this.maxHp) / 100) {
            this.rageModeOn();
        }

        const dmg = new DamageText(damage, this.actor, {
            isCritical
        });
        dmg.once("done", () => this.damageContainer.delete(dmg));
        this.damageContainer.add(dmg);

        return this;
    }

    canAttack() {
        const distance = this.actor.pos.distanceTo(this.target.pos);

        if (!this.rageMode) {
            if (distance <= this.attackingRangeForMelee) {
                if (!this.delayBeforeNextMeleeAttack.isStarted) {
                    this.delayBeforeNextMeleeAttack.start();

                    if (!this.timerForCurrentMeleeAttack.isStarted) {
                        this.timerForCurrentMeleeAttack.start();
                    }

                    if (this.timerForCurrentMeleeAttack.walk()) {
                        return false;
                    }

                    return "melee-attack";
                }

                if (!this.delayBeforeNextMeleeAttack.walk()) {
                    return false;
                }
            }
            else if (distance <= this.attackingRangeForDist && distance >= this.minRangeForDist) {
                if (!this.delayBeforeNextDistAttack.isStarted) {
                    this.delayBeforeNextDistAttack.start();

                    if (!this.timerForCurrentDistAttack.isStarted) {
                        this.timerForCurrentDistAttack.start();
                    }

                    if (this.timerForCurrentDistAttack.walk()) {
                        return false;
                    }

                    return "dist-attack";
                }

                if (!this.delayBeforeNextDistAttack.walk()) {
                    return false;
                }
            }
            else {
                if (this.timerForCurrentDistAttack.isStarted) {
                    this.timerForCurrentDistAttack.reset();
                }

                if (this.timerForCurrentMeleeAttack.isStarted) {
                    this.timerForCurrentMeleeAttack.reset();
                }
            }
        }
        else {
            if (distance <= this.attackingRangeForMelee) {
                if (!this.delayBeforeNextMeleeAttack.isStarted) {
                    this.delayBeforeNextMeleeAttack.start();

                    if (!this.timerForCurrentMeleeAttack.isStarted) {
                        this.timerForCurrentMeleeAttack.start();
                    }

                    if (this.timerForCurrentMeleeAttack.walk()) {
                        return false;
                    }

                    return "rage-melee-attack";
                }

                if (!this.delayBeforeNextMeleeAttack.walk()) {
                    return false;
                }
            } else if (distance <= this.attackingRangeForSpecialAttack) {
                if (!this.delayBeforeNextSpecialAttack.isStarted) {
                    this.delayBeforeNextSpecialAttack.start();

                    if (!this.timerForCurrentSpecialAttack.isStarted) {
                        this.timerForCurrentSpecialAttack.start();
                    }

                    if (this.timerForCurrentSpecialAttack.walk()) {
                        return false;
                    }

                    return "rage-special-attack";
                }

                if (!this.delayBeforeNextSpecialAttack.walk()) {
                    return false;
                }
            } else {
                if (this.timerForCurrentSpecialAttack.isStarted) {
                    this.timerForCurrentSpecialAttack.reset();
                }

                if (this.timerForCurrentMeleeAttack.isStarted) {
                    this.timerForCurrentMeleeAttack.reset();
                }
            }
        }

        return false;
    }

    initAttack(type) {
        if (type === "melee-attack") {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("takeDamage", this.meleeDamage);
        } else if (type === "dist-attack") {
            game.rootScene.add(EntityBuilder.create("actor:projectile", {
                startPos: { x: this.actor.x, y: this.actor.y },
                targetPos: { x: this.target.x, y: this.target.y },
                stat: {
                    fadeInFrames: 240,
                    radius: 25,
                    damage: this.rangedDamage
                },
                sprites: {
                    name: "adventurer",
                    start: "adventurer-idle",
                    while: "adventurer-run",
                    end: "adventurer-die"
                }
            }));
        } else if (type === "rage-melee-attack") {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("takeDamage", this.meleeDamage + 1);
        } else if (type === "rage-special-attack") {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("takeDamage", this.specialAttackDamage);
        }
    }

    computeMovement() {
        if ((
                !this.timerForCurrentDistAttack.isStarted &&
                !this.timerForCurrentMeleeAttack.isStarted &&
                !this.timerForCurrentSpecialAttack.isStarted
            ) && (
                this.delayToMove.walk() || this.isMoving
        )) {
            if (!this.isMoving) {
                const r = (this.deplacementAreaRadius / 2) * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const x = Math.round(this.actor.x + r * Math.cos(theta));
                const y = Math.round(this.actor.y + r * Math.sin(theta));

                this.nextPos.x = x;
                this.nextPos.y = y;
            }

            const distance = this.actor.pos.distanceTo(this.target.pos);
            if (distance < this.targetingRangeForMelee) {
                this.nextPos.x = this.target.x;
                this.nextPos.y = this.target.y
            }

            const distanceBetweenAnchorAndNextPos = this.anchor.distanceTo(this.nextPos);
            if (distanceBetweenAnchorAndNextPos >= this.deplacementMaxAreaRadius) {
                this.nextPos.x = this.anchor.x;
                this.nextPos.y = this.anchor.y;
            }

            this.goTo();
        }

        return;
    }

    goTo() {
        if (Math.round(this.nextPos.x) === Math.round(this.actor.x) && Math.round(this.nextPos.y) === Math.round(this.actor.y)) {
            this.nextPos.x = null;
            this.nextPos.y = null;

            this.sprite.scale.x = 1;
            this.isMoving = false;
            this.delayToMove.start();
        }
        else {
            this.isMoving = true;
            if (Math.round(this.actor.x) !== Math.round(this.nextPos.x)) {
                if (this.actor.x < this.nextPos.x) {
                    let speedToApply = this.currentSpeed;

                    const diff = this.nextPos.x - this.actor.x;
                    if (diff < this.currentSpeed) speedToApply = diff;

                    this.actor.moveX(speedToApply);
                    this.sprite.scale.x = 1;
                }
                else if (this.actor.x > this.nextPos.x) {
                    let speedToApply = this.currentSpeed;

                    const diff = this.actor.x - this.nextPos.x;
                    if (diff < this.currentSpeed) speedToApply = diff;

                    this.actor.moveX(-speedToApply);
                    this.sprite.scale.x = -1;
                }
            }

            if (Math.round(this.actor.y) !== Math.round(this.nextPos.y)) {
                if (this.actor.y < this.nextPos.y) {
                    let speedToApply = this.currentSpeed;

                    const diff = this.nextPos.y - this.actor.y;
                    if (diff < this.currentSpeed) speedToApply = diff;

                    this.actor.moveY(speedToApply);
                } else if (this.actor.y > this.nextPos.y) {
                    let speedToApply = this.currentSpeed;

                    const diff = this.actor.y - this.nextPos.y;
                    if (diff < this.currentSpeed) speedToApply = diff;

                    this.actor.moveY(-speedToApply);
                }
            }
        }
    }

    computeAnimations() {
        if (this.timerForCurrentMeleeAttack.isStarted && !this.timerForCurrentMeleeAttack.walk()) {
            this.sprite.playAnimation("adventurer-attack1");
        }
        else if (this.timerForCurrentDistAttack.isStarted && !this.timerForCurrentDistAttack.walk()) {
            this.sprite.playAnimation("adventurer-attack2");
        }
        else if (this.timerForCurrentSpecialAttack.isStarted && !this.timerForCurrentSpecialAttack.walk()) {
            this.sprite.playAnimation("adventurer-attack3");
        }
        else {
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-idle");
        }
    }

    rageModeOn() {
        console.log("rage mode on !");

        this.currentSpeed *= 2;
        this.rageMode = true;
    }

    rageModeOff() {
        console.log("rage mode off!");

        this.currentSpeed = 1;
        this.rageMode = false;
    }

    die() {
        if (!this.isDead && this.isDying()) {
            this.sprite.playAnimation("adventurer-die");
        }

        if (!this.isDead && !this.isDying()) {
            this.winSound.play();
            this.cleanSprite();
        }
    }

    isDying() {
        if (!this.timerForDying.isStarted) {
            this.timerForDying.start();
        }

        if (!this.timerForDying.walk()) {
            return true;
        } else {
            return false;
        }
    }

    cleanSprite() {
        this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);

        this.lifeBar.cleanup();

        if (this.sprite) {
            this.sprite.destroy();
        }

        this.isDead = true;
    }

    update() {
        if (this.currentHp <= 0) {
            this.die();

            if (this.isDead) {
                if (this.teleporting) {
                    return;
                }

                const distance = this.actor.pos.distanceTo(this.target.pos);
                // console.log(distance);
                if (distance < 150 && Inputs.use()) {
                    this.warp();
                }
            }
        } else {
            this.canBeAttacked();

            for (const dmg of this.damageContainer) {
                dmg.update();
            }

            const attackStatus = this.canAttack();
            if (attackStatus) {
                this.initAttack(attackStatus);
            }

            if (this.rageMode) {
                if (this.time.walk() && this.currentHp < this.maxHp) {
                    this.currentHp += 0.5;
                }

                if (this.currentHp === this.maxHp) {
                    this.rageModeOff();
                }
            }

            this.computeMovement();

            this.computeAnimations();

            this.actor.applyVelocity();
            this.lifeBar.update(this.currentHp);
        }
    }
}

ScriptBehavior.define("BossBehavior", BossBehavior);
