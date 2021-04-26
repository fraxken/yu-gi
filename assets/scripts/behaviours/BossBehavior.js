import { sound } from "@pixi/sound";

// Import dependencies
import { ScriptBehavior, getActor, Timer, Components, Vector2, getCurrentState } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import { Inputs } from "../keys";
import * as EntityBuilder from "../helpers/entitybuilder.js";

// CONSTS
const kHandicapBetweenDeplacement = 200;

const kHandicapBetweenMeleeAttack = 160;
const kHandicapForMeleeAttack = 110;

const kHandicapBetweenDistAttack = 200;
const kHandicapForDistAttack = 110;

const kHandicapBetweenSpecialAttack = 240;
const kHandicapForSpecialAttack = 110;

const kDelayToDie = 120;

export default class BossBehavior extends ScriptBehavior {
    constructor(options = {
        defenseMultiplier: 1,
        attackMultiplier: 1,
        hpMultiplier: 1,
        missRatio: 0.45,
        goldMultiplier: 1
    }) {
        super();

        // Default stats
        this.deplacementAreaRadius = 30;
        this.deplacementMaxAreaRadius = 320;
        this.targetingRangeForMelee = 120;
        this.attackingRangeForMelee = 40;
        this.meleeDamage = 4.5 * options[0].attackMultiplier;
        this.minRangeForDist = 120;
        this.attackingRangeForDist = 200;
        this.rangedDamage = 3 * options[0].attackMultiplier;
        this.attackingRangeForSpecialAttack = 60;
        this.specialAttackDamage = 7 * options[0].attackMultiplier;
        this.missRatio = 0.5 * options[0].missRatio;
        this.defense = 1 * options[0].defenseMultiplier;
        this.currentHp = 25 * options[0].hpMultiplier;
        this.maxHp = 25 * options[0].hpMultiplier;
        this.currentSpeed = 0.8;
        this.goldReward = 35 * options[0].goldMultiplier;

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

        this.state = getCurrentState();

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

        if (damage !== 0) {
            damage -= this.defense;
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

                    return "melee-attack";
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

                    return "special-attack";
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
        if (this.actor.x < this.target.pos.x) {
            this.sprite.scale.x = 1;
        } else {
            this.sprite.scale.x = -1;
        }

        const isCritical = Math.random() < 0.05;

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        const isHitting = Math.random() < this.missratio ? false : true;

        if (type === "melee-attack" || type === "special-attack") {
            if (isHitting) {
                if (type === "melee-attack") {
                    const damageToApply = isCritical ? this.meleeDamage * 2 : this.meleeDamage;

                    script.sendMessage("takeDamage", damageToApply, { isCritical });
                }
                else if (type === "special-attack") {
                    const damageToApply = isCritical ? this.specialAttackDamage * 2 : this.specialAttackDamage;

                    script.sendMessage("takeDamage", damageToApply, { isCritical });
                }
            }
            else {
                script.sendMessage("takeDamage", 0, false);
            }
        } else if (type === "dist-attack") {
            const damageToApply = isCritical ? this.rangedDamage * 2 : this.rangedDamage;

            game.rootScene.add(EntityBuilder.create("actor:projectile", {
                startPos: { x: this.actor.x, y: this.actor.y },
                targetPos: { x: this.target.x, y: this.target.y },
                stat: {
                    fadeInFrames: 240,
                    radius: 25,
                    damage: damageToApply,
                    missRatio: this.missRatio
                },
                sprites: {
                    name: "adventurer",
                    start: "adventurer-idle",
                    while: "adventurer-run",
                    end: "adventurer-die"
                }
            }));
        }
    }

    computeMovement() {
        if (this.timerForCurrentDistAttack.isStarted ||
            this.timerForCurrentMeleeAttack.isStarted ||
            this.timerForCurrentSpecialAttack.isStarted
        ) {
                this.delayToMove.reset();

                return;
        }

        if (!this.delayToMove.isStarted && this.isMoving) {
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

            return;
        }

        if (this.delayToMove.walk() || this.isMoving) {
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
    }

    goTo() {
        if (Math.round(this.nextPos.x) === Math.round(this.actor.x) && Math.round(this.nextPos.y) === Math.round(this.actor.y)) {
            this.nextPos.x = null;
            this.nextPos.y = null;

            this.isMoving = false;
            this.delayToMove.reset()
                .start();
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

        this.meleeDamage += 1;
        this.currentSpeed *= 2;
        this.rageMode = true;
    }

    rageModeOff() {
        console.log("rage mode off!");

        this.meleeDamage -= 1;
        this.currentSpeed = 0.8;
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

        const player = this.state.getState("player");
        this.state.setState("player", {
            currentHp: player.currentHp,
            gold: player.gold + this.goldReward,
            maxHp: player.maxHp
        });

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
