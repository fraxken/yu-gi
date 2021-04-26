import { Actor, ScriptBehavior, Components, Timer, getActor, Vector2, getCurrentState } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import * as EntityBuilder from "../helpers/entitybuilder.js";

const kHandicapForDeplacement = 120;

const kHandicapBetweenShoot = 220;
const kHandicapForShoot = 110;

export default class CasterBehavior extends ScriptBehavior {

    constructor(options = {
        defenseMultiplier: 1,
        attackMultiplier: 1,
        hpMultiplier: 1,
        missRatio: 0.45,
        goldMultiplier: 1
    }) {
        super();

        // Default stats
        this.deplacementAreaRadius = 20;
        this.deplacementMaxAreaRadius = 160;
        this.attackingRange = 220;
        this.damage = 2 * options[0].attackMultiplier;
        this.missRatio = options[0].missRatio;
        this.defense = 0.5 * options[0].defenseMultiplier;
        this.currentHp = 5.5 * options[0].hpMultiplier;
        this.maxHp = 5.5 * options[0].hpMultiplier;
        this.currentSpeed = 0.5;
        this.goldReward = 5 * options[0].goldMultiplier;

        this.isFocusing = false;

        // Deplacements
        this.isMoving = false;
        this.nextPos = { x: null, y: null };
        this.delayToMove = new Timer(kHandicapForDeplacement, { keepIterating: false });

        // Attacks
        this.delayBeforeNextShoot = new Timer(kHandicapBetweenShoot, { autoStart: false, keepIterating: false });
        this.timerForCurrentShoot = new Timer(kHandicapForShoot, { autoStart: false, keepIterating: false });

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

    focusOn() {
        console.log("focusing player !");

        this.isFocusing = true;
    }

    focusOff() {
        console.log("Not focusing player ! ");

        this.isFocusing = false;
    }

    die() {
        this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);

        const playerGold = this.state.getState("player.gold");
        this.state.setState("player.gold", playerGold + this.goldReward);

        this.actor.cleanup();
    }

    canBeAttacked() {
        const distance = this.actor.pos.distanceTo(this.target.pos);

        if (distance <= 400) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("inRange", { actorData: this.actor.name, isMelee: false });
        } else {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", { actorData: this.actor.name, isMelee: false });
        }

        if (distance <= 40) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("inRange", { actorData: this.actor.name, isMelee: true });
        }
        else {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", { actorData: this.actor.name, isMelee: true });
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


    canShoot() {
        const distance = this.actor.pos.distanceTo(this.target.pos);

        if (distance <= this.attackingRange) {
            if (!this.delayBeforeNextShoot.isStarted) {
                this.delayBeforeNextShoot.start();

                if (!this.timerForCurrentShoot.isStarted) {
                    this.timerForCurrentShoot.start();
                }

                if (!this.timerForCurrentShoot.walk()) {
                    return false;
                }


                return true;
            } else {
                if (!this.delayBeforeNextShoot.walk()) {
                    return false;
                }
            }

            return true;
        } else {
            if (this.timerForCurrentShoot.isStarted) {
                this.timerForCurrentShoot.reset();
            }
        }

        return false;
    }

    initShoot() {
        if (this.actor.x < this.target.pos.x) {
            this.sprite.scale.x = 1;
        } else {
            this.sprite.scale.x = -1;
        }

        game.rootScene.add(EntityBuilder.create("actor:projectile", {
            startPos: { x: Math.round(this.actor.x), y: Math.round(this.actor.y) },
            targetPos: { x: Math.round(this.target.x), y: Math.round(this.target.y) },
            stat: {
                fadeInFrames: 240,
                radius: 15,
                damage: this.damage,
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

    getRandomPos() {
        const r = (120 / 2) * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const x = Math.round(this.target.pos.x + r * Math.cos(theta));
        const y = Math.round(this.target.pos.y + r * Math.sin(theta));

        this.nextPos.x = x;
        this.nextPos.y = y;
    }

    computeMovement() {
        if (this.timerForCurrentShoot.isStarted) {
            this.delayToMove.reset();

            return;
        }

        if (this.isFocusing) {
            if (!this.isMoving && !this.timerForCurrentShoot.isStarted) {
                this.getRandomPos();
            }

            const distanceBetweenTargetAndNextPos = this.target.pos.distanceTo(this.nextPos);
            if (this.isMoving && distanceBetweenTargetAndNextPos > 120) {
                this.getRandomPos();
            }

            const distanceBetweenAnchorAndNextPos = this.anchor.distanceTo(this.nextPos);
            if (distanceBetweenAnchorAndNextPos >= 220) {
                this.nextPos.x = this.anchor.x;
                this.nextPos.y = this.anchor.y;
            }

            this.goTo();

            return;
        }

        if (!this.timerForCurrentShoot.isStarted && this.isMoving) {
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

    update() {
        this.canBeAttacked();

        for (const dmg of this.damageContainer) {
            dmg.update();
        }

        if (this.canShoot()) {
            this.initShoot();
        }

        this.computeMovement();

        if (this.timerForCurrentShoot.isStarted && !this.timerForCurrentShoot.walk()) {
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

ScriptBehavior.define("CasterBehavior", CasterBehavior);

EntityBuilder.define("actor:caster", (options = {}) => {
    return new Actor(EntityBuilder.increment("caster"))
        .createScriptedBehavior(new CasterBehavior(options));
});
