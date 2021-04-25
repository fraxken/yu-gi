// Import dependencies
import { ScriptBehavior, getActor, Timer, Components } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import { Inputs } from "../keys";
import * as EntityBuilder from "../helpers/entitybuilder.js";

// CONSTS
const kHandicapBetweenDeplacement = 60;

const kHandicapBetweenMeleeAttack = 160;
const kHandicapForMeleeAttack = 110;

const kHandicapBetweenDistAttack = 240;
const kHandicapForDistAttack = 110;

const kHandicapBetweenSpecialAttack = 300;
const kHandicapForSpecialAttack = 110;

export default class BossBehavior extends ScriptBehavior {
    constructor() {
        super();

        // Default stats
        this.deplacementAreaRadius = 10;
        this.targetingRangeForMelee = 120;
        this.attackingRangeForMelee = 30;
        this.meleeDamage = 4;
        this.minRangeForDist = 60;
        this.attackingRangeForDist = 240;
        this.rangedDamage = 1;
        this.currentHp = 5;
        this.maxHp = 25;

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
        this.timerForSpecialAttack = new Timer(kHandicapForSpecialAttack, { autoStart: false, keepIterating: false });

        this.isDead = false;
        this.timerForDying = new Timer(160, { autoStart: false, keepIterating: false });

        this.teleporting = false;
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

        this.actor.addChild(this.lifeBar.container);
    }

    start() {
        this.target = getActor("player");
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
        const dmg = new DamageText(damage, this.actor, { isCritical: Math.random() > 0.5 });
        dmg.once("done", () => this.damageContainer.delete(dmg));
        this.damageContainer.add(dmg);

        return this;
    }

    canAttack() {
        const distance = this.actor.pos.distanceTo(this.target.pos);

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
        } else if (distance <= this.attackingRangeForDist && distance >= this.minRangeForDist) {
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
        } else {
            if (this.timerForCurrentDistAttack.isStarted) {
                this.timerForCurrentDistAttack.reset();
            }

            if (this.timerForCurrentMeleeAttack.isStarted) {
                this.timerForCurrentMeleeAttack.reset();
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
        }
    }

    die() {
        if (!this.isDead && this.isDying()) {
            this.sprite.playAnimation("adventurer-die");
        }

        if (!this.isDead && !this.isDying()) {
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
        this.canBeAttacked();
        this.lifeBar.update(this.currentHp);

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
            const attackStatus = this.canAttack();
            
            if (attackStatus) {
                this.initAttack(attackStatus);
            }
        }
    }
}

ScriptBehavior.define("BossBehavior", BossBehavior);
