// Import dependencies
import { ScriptBehavior, getActor, Timer, Components } from "../ECS";
import { LifeBar } from "../helpers";
import DamageText from "../helpers/DamageText";
import { Inputs } from "../keys";

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
        this.targetingRange = 200;
        this.attackingRange = 10;
        this.currentHp = 5;
        this.maxHp = 25;

        // Deplacements
        this.isMoving = false;
        this.nextPos = { x: null, y: null };
        this.delayToMove = new Timer(kHandicapBetweenDeplacement,  { keepIterating: false });

        this.isAttacking = false;
        // Melee Attack
        this.delayBeforeNextMeleeAttack = new Timer(kHandicapBetweenMeleeAttack, { autoStart: false, keepIterating: false });
        this.timerForCurrentAttack = new Timer(kHandicapForMeleeAttack, { autoStart: false, keepIterating: false });

        // Dist Attack
        this.delayBeforeNextDistAttack = new Timer(kHandicapBetweenDistAttack, { autoStart: false, keepIterating: false });
        this.timerForCurrentDistAttack = new Timer(kHandicapForDistAttack, { autoStart: false, keepIterating: false });

        // Special Attack
        this.delayBeforeNextSpecialAttack = new Timer(kHandicapBetweenSpecialAttack, { autoStart: false, keepIterating: false });
        this.timerForSpecialAttack = new Timer(kHandicapForSpecialAttack, { autoStart: false, keepIterating: false });

        // Die
        this.isDead = false;
        this.timerForDying = new Timer(110, { autoStart: false, keepIterating: false });

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
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= 40 * 40;

        if (isInside) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("inRange", this.actor.name);
        } else {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("outRange", this.actor.name);
        }
    }

    takeDamage(damage) {
        this.currentHp -= damage;
        const dmg = new DamageText(damage, this.actor, { isCritical: Math.random() > 0.5 });
        dmg.once("done", () => this.damageContainer.delete(dmg));
        this.damageContainer.add(dmg);

        return this;
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

    die() {
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

            if (!this.isDead && !this.isDying()) {
                this.die();
            }

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
        }
    }
}

ScriptBehavior.define("BossBehavior", BossBehavior);
