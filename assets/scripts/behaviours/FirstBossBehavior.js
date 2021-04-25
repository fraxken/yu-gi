import { Actor, ScriptBehavior, Components, Timer, getActor, Vector2 } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import * as EntityBuilder from "../helpers/entitybuilder.js";

const kHandicapForDeplacement = 120;
const kHandicapForAttacking = 240;

export default class FirstBossBehavior extends ScriptBehavior {

    constructor(options = {
        position: {
            x: 0,
            y: 0,
            radius: 200
        },
        stat: {
            radiusForDeplacement: 200,
            targetingRange: 60,
            meleeRange: 8,
            baseHp: 20,
            maxHp: 20,
            bodyRadius: 40,
            delayBetweenAttacks: 240,
            delayBetweenDeplacement: 120
        }
    }) {
        super();

        const r = options.position.radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;

        this.position = {
            x: Math.round(options.position.x + r * Math.cos(theta)),
            y: Math.round(options.position.y + r * Math.sin(theta))
        };

        // Default stats
        this.radiusForDeplacement = options.stat.radiusForDeplacement;
        this.targetingRange = options.stat.targetingRange;
        this.meleeRange = options.stat.meleeRange;
        this.currentHp = options.stat.baseHp;
        this.maxHp = options.stat.maxHp;

        this.isMoving = false;
        this.nextPos = { x: null, y: null };
        this.delayToMove = new Timer(options.stat.delayBetweenDeplacement, { keepIterating: false });

        this.delayToAttack = new Timer(options.stat.delayBetweenAttacks, { autoStart: false, keepIterating: false });
        this.attackTimer = new Timer(110, { autoStart: false, keepIterating: false });
        this.randomAttack = null;

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
            maxHpBarLength: 80
        });

        this.actor.addChild(this.lifeBar.container);

        this.actor.position.set(this.position.x, this.position.y);
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
                const r = (this.radiusForDeplacement / 2) * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const x = Math.round(this.position.x + r * Math.cos(theta));
                const y = Math.round(this.position.y + r * Math.sin(theta));

                this.nextPos.x = x;
                this.nextPos.y = y;
            }

            if (Math.pow(this.position.x - this.target.x, 2) + Math.pow(this.position.y - this.target.y, 2) <= this.targetingRange * this.targetingRange) {
                this.nextPos.x = this.target.x;
                this.nextPos.y = this.target.y
            }

            this.goTo();
        }

        if (this.attackTimer.isStarted && !this.attackTimer.walk()) {
            this.sprite.playAnimation(`adventurer-attack${this.randomAttack}`);
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
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= this.bodyRadius * this.bodyRadius;

        if (isInside) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("inRange", this.actor.name);
        } else {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);
        }
    }

    canAttack() {
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= this.meleeRange;

        if (isInside) {
            if (!this.delayToAttack.isStarted) {
                this.delayToAttack.start();

                if (!this.attackTimer.isStarted) {
                    this.attackTimer.start();

                    this.randomAttack = Math.floor(Math.random() * 3) + 1;
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

ScriptBehavior.define("FirstBossBehavior", FirstBossBehavior);

EntityBuilder.define("actor:firstBoss", (options = {}) => {
    return new Actor(EntityBuilder.increment("firstBoss"))
        .createScriptedBehavior(new FirstBossBehavior(options));
});
