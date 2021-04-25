import { Actor, ScriptBehavior, Components, Timer, getActor, Vector2 } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import * as EntityBuilder from "../helpers/entitybuilder.js";

const kHandicapForDeplacement = 120;
const kHandicapForAttacking = 240;

export default class MeleeBehavior extends ScriptBehavior {
    constructor() {
        super();

        // Default stats
        this.radius = 40;
        this.targetRange = 60;
        this.range = 4;
        this.currentHp = 8;
        this.maxHp = 8;

        this.isMoving = false;
        this.nextPos = { x: null, y: null };
        this.delayToMove = new Timer(kHandicapForDeplacement, { keepIterating: false });
        this.delayToAttack = new Timer(kHandicapForAttacking, { autoStart: false, keepIterating: false });
        this.attackTimer = new Timer(90, { autoStart: false, keepIterating: false });
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

    update() {
        this.canBeAttacked();

        if (this.canAttack()) {
            this.initAttack();
        }

        if ((this.delayToMove.walk() || this.isMoving) && !this.attackTimer.isStarted) {
            if (!this.isMoving) {
                const r = (this.radius / 2) * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const x = Math.round(this.actor.x + r * Math.cos(theta));
                const y = Math.round(this.actor.y + r * Math.sin(theta));

                this.nextPos.x = x;
                this.nextPos.y = y;
            }

            if (Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= this.targetRange * this.targetRange) {
                this.nextPos.x = this.target.x;
                this.nextPos.y = this.target.y
            }

            this.goTo();
        }

        if (this.attackTimer.isStarted && !this.attackTimer.walk()) {
            this.sprite.playAnimation("adventurer-attack1");
        } else {
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-idle");
        }

        this.lifeBar.update(this.currentHp);

        if (this.currentHp <= 0) {
            this.die();
        }
    }

    die() {
        this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);

        this.actor.cleanup();
    }

    takeDamage(damage) {
        this.currentHp -= damage;
        const dmg = new DamageText(damage, this.actor, { isCritical: Math.random() > 0.5 });
        dmg.once("done", () => this.damageContainer.delete(dmg));
        this.damageContainer.add(dmg);

        return this;
    }

    canBeAttacked() {
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= 40 * 40;

        if (isInside) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("inRange", this.actor.name);
        } else {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);
        }
    }

    canAttack() {
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= this.range;

        if (isInside) {
            if (!this.delayToAttack.isStarted) {
                this.delayToAttack.start();

                if (!this.attackTimer.isStarted) {
                    this.attackTimer.start();
                }

                if (this.attackTimer.walk()) {
                    return false;
                }

                return true;
            }

            if (!this.delayToAttack.walk()) {
                return false;
            }
        }

        if (this.attackTimer.isStarted) {
            this.attackTimer.reset();
        }

        return false;
    }

    initAttack() {
        this.target.getScriptedBehavior("PlayerBehavior").sendMessage("takeDamage", 2);
    }

    goTo() {
        if (Math.round(this.nextPos.x) === Math.round(this.actor.x) && Math.round(this.nextPos.y) === Math.round(this.actor.y)) {
            this.nextPos.x = null;
            this.nextPos.y = null;

            this.isMoving = false;
            this.delayToMove.start();
        }
        else {
            this.isMoving = true;
            if (Math.round(this.actor.x) !== Math.round(this.nextPos.x)) this.actor.x = this.actor.x < this.nextPos.x ? this.actor.x +1: this.actor.x -1;
            if (Math.round(this.actor.y) !== Math.round(this.nextPos.y)) this.actor.y = this.actor.y < this.nextPos.y ? this.actor.y +1: this.actor.y -1;
        }
    }
}

ScriptBehavior.define("MeleeBehavior", MeleeBehavior);

EntityBuilder.define("actor:melee", (options = {}) => {
    return new Actor(EntityBuilder.increment("melee"))
        .createScriptedBehavior(new MeleeBehavior(options));
});
