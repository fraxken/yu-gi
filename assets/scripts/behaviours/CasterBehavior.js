

import { Actor, ScriptBehavior, Components, Timer, getActor, Vector2 } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import * as EntityBuilder from "../helpers/entitybuilder.js";

const kHandicapForDeplacement = 120;
const kHandicapForShooting = 280;

export default class CasterBehavior extends ScriptBehavior {

    constructor(options = { x: 0, y: 0, radius: 200 }) {
        super();

        const r = options.radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;

        this.position = {
            x: Math.round(options.x + r * Math.cos(theta)),
            y: Math.round(options.y + r * Math.sin(theta))
        };

        // Default stats
        this.radius = 20;
        this.range = 180;
        this.currentHp = 3;
        this.maxHp = 3;

        this.isMoving = false;
        this.nextPos = { x: null, y: null };
        this.delayToMove = new Timer(kHandicapForDeplacement, { keepIterating: false });
        this.delayToShoot = new Timer(kHandicapForShooting, { autoStart: false, keepIterating: false });
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

        this.actor.position.set(this.position.x, this.position.y);
    }

    start() {
        this.target = getActor("player");
    }

    update() {
        this.canBeAttacked();

        if (this.canShoot()) {
            this.initShoot();
        }

        if (this.delayToMove.walk() || this.isMoving) {
            if (!this.isMoving) {
                const r = (this.radius / 2) * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const x = Math.round(this.position.x + r * Math.cos(theta));
                const y = Math.round(this.position.y + r * Math.sin(theta));

                this.nextPos.x = x;
                this.nextPos.y = y;
            }

            this.goTo();
        }

        this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-idle");
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

    canShoot() {
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= this.range * this.range;

        if (isInside) {
            if (!this.delayToShoot.isStarted) {
                this.delayToShoot.start();

                return false
            }

            if (this.delayToShoot.walk()) {
                this.delayToShoot.reset();

                return true;
            }
        }

        return false;
    }

    initShoot() {
        game.rootScene.add(EntityBuilder.create("actor:projectile", {
            startPos: { x: this.actor.x, y: this.actor.y },
            targetPos: { x: this.target.x, y: this.target.y }
        }));
    }

    goTo() {
        if (this.nextPos.x === this.actor.x && this.nextPos.y === this.actor.y) {
            this.nextPos.x = null;
            this.nextPos.y = null;

            this.isMoving = false;
            this.delayToMove.start();
        }
        else {
            this.isMoving = true;
            if (this.actor.x !== this.nextPos.x) this.actor.x = this.actor.x < this.nextPos.x ? this.actor.x +1: this.actor.x -1;
            if (this.actor.y !== this.nextPos.y) this.actor.y = this.actor.y < this.nextPos.y ? this.actor.y +1: this.actor.y -1;
        }
    }
}

ScriptBehavior.define("CasterBehavior", CasterBehavior);

EntityBuilder.define("actor:caster", (options = {}) => {
    return new Actor(EntityBuilder.increment("caster"))
        .createScriptedBehavior(new CasterBehavior(options));
});
