import { Actor, ScriptBehavior, Components, Timer, getActor, Vector2, getCurrentState } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import * as EntityBuilder from "../helpers/entitybuilder.js";

const kHandicapForDeplacement = 120;

const kHandicapBetweenAttack = 240;
const kHandicapForAttack = 110;

export default class MeleeBehavior extends ScriptBehavior {
    constructor(options = {
        defenseMultiplier: 1,
        attackMultiplier: 1,
        hpMultiplier: 1,
        missRatio: 0.45,
        goldMultiplier: 1
    }) {
        super();

        // Default stats
        this.deplacementAreaRadius = 40;
        this.deplacementMaxAreaRadius = 280;
        this.targetingRange = 60;
        this.attackingRange = 10;
        this.damage = 2 * options[0].attackMultiplier;
        this.missratio = options[0].missRatio;
        this.defense = 1 * options[0].defenseMultiplier;
        this.currentHp = 8 * options[0].hpMultiplier;
        this.maxHp = 8 * options[0].hpMultiplier;
        this.currentSpeed = 0.7;
        this.goldReward = 2 * options[0].goldMultiplier;

        // Deplacements
        this.isMoving = false;
        this.nextPos = { x: null, y: null };
        this.delayToMove = new Timer(kHandicapForDeplacement, { keepIterating: false });

        // Attacks
        this.delayBeforeNextAttack = new Timer(kHandicapBetweenAttack, { autoStart: false, keepIterating: false });
        this.timerForCurrentAttack = new Timer(kHandicapForAttack, { autoStart: false, keepIterating: false });

        this.state = getCurrentState();

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
    }

    die() {
        this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);

        const player = this.state.getState("player");
        this.state.setState("player", {
            currentHp: player.currentHp,
            gold: player.gold + this.goldReward,
            maxHp: player.maxHp
        });

        this.actor.cleanup();
    }

    canBeAttacked() {
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= 40 * 40;

        if (isInside) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("inRange", this.actor.name);
        } else {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);
        }
    }
    takeDamage(damage, { isCritical = false } = {}) {
        if (typeof damage !== "number") {
            damage = 0;
        }

        if (damage !== 0) {
            damage -= this.defense;
        }

        if (this.currentHp - damage <= 0) {
            this.currentHp = 0;
        }

        this.currentHp -= damage;
        const dmg = new DamageText(damage, this.actor, { isCritical });
        dmg.once("done", () => this.damageContainer.delete(dmg));
        this.damageContainer.add(dmg);

        return this;
    }

    canAttack() {
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= this.attackingRange;

        if (isInside) {
            if (!this.delayBeforeNextAttack.isStarted) {
                this.delayBeforeNextAttack.start();

                if (!this.timerForCurrentAttack.isStarted) {
                    this.timerForCurrentAttack.start();
                }

                if (this.timerForCurrentAttack.walk()) {
                    return false;
                }

                return true;
            }

            if (!this.delayBeforeNextAttack.walk()) {
                return false;
            }
        }

        if (this.timerForCurrentAttack.isStarted) {
            this.timerForCurrentAttack.reset();
        }

        return false;
    }

    initAttack() {
        const isCritical = Math.random() < 0.05;
        const damageToApply = isCritical ? this.damage * 2 : this.damage;

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        const isHitting = Math.random() < this.missratio ? false : true;
        if (isHitting) {
            script.sendMessage("takeDamage", damageToApply, { isCritical });
        }
        else {
            script.sendMessage("takeDamage", 0);
        }
    }

    computeMovement() {
        if ((this.delayToMove.walk() || this.isMoving) && !this.timerForCurrentAttack.isStarted) {
            if (!this.isMoving) {
                const r = (this.deplacementAreaRadius / 2) * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const x = Math.round(this.actor.x + r * Math.cos(theta));
                const y = Math.round(this.actor.y + r * Math.sin(theta));

                this.nextPos.x = x;
                this.nextPos.y = y;
            }

            const distance = this.actor.pos.distanceTo(this.target.pos);
            if (distance < this.targetingRange) {
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
                    this.actor.moveX(this.currentSpeed);
                    this.sprite.scale.x = 1;
                }
                else if (this.actor.x > this.nextPos.x) {
                    this.actor.moveX(-this.currentSpeed);
                    this.sprite.scale.x = -1;
                }
            }

            if (Math.round(this.actor.y) !== Math.round(this.nextPos.y)) {
                if (this.actor.y < this.nextPos.y) {
                    this.actor.moveY(this.currentSpeed);
                }
                else if (this.actor.y > this.nextPos.y) {
                    this.actor.moveY(-this.currentSpeed);
                }
            }
        }
    }

    update() {
        this.canBeAttacked();

        for (const dmg of this.damageContainer) {
            dmg.update();
        }

        if (this.canAttack()) {
            this.initAttack();
        }

        this.computeMovement();

        if (this.timerForCurrentAttack.isStarted && !this.timerForCurrentAttack.walk()) {
            this.sprite.playAnimation("adventurer-attack1");
        } else {
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-idle");
        }

        this.actor.applyVelocity();
        this.lifeBar.update(this.currentHp);
        if (this.currentHp <= 0) {
            this.die();
        }
    }
}

ScriptBehavior.define("MeleeBehavior", MeleeBehavior);

EntityBuilder.define("actor:melee", (options = {}) => {
    return new Actor(EntityBuilder.increment("melee"))
        .createScriptedBehavior(new MeleeBehavior(options));
});
