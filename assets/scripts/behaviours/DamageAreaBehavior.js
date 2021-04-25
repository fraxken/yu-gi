// Import dependencies
import { ScriptBehavior, getActor, Timer, boxesIntersect } from "../ECS";
// import { Inputs } from "../keys";

export default class DamageAreaBehavior extends ScriptBehavior {
    constructor() {
        super();

        this.activationDelay = new Timer(180, { autoStart: true, keepIterating: true });
        this.hitTimer = new Timer(80, { autoStart: false, keepIterating: false });
        this.damage = 2;
        this.triggered = false;

        this.draw(this.triggered ? "#B71C1C" : "#FFFFFF");
    }

    awake() {
        /** @type {PIXI.Graphics} */
        this.graphic = this.actor.children[0];
    }

    /**
     * @param {!string} color
     */
    draw(color) {
        if (this.graphic) {
            const { width, height } = this.graphic;
            this.graphic.clear()
                .beginFill(PIXI.utils.string2hex(color), 0.6)
                .drawRect(0, 0, width, height)
                .endFill();
        }
    }

    start() {
        this.target = getActor("player");
    }

    hit() {
        this.hitTimer.start();
        const isCritical = Math.random() < 0.05;
        const damageToApply = isCritical ? this.damage * 2 : this.damage;

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        script.sendMessage("takeDamage", damageToApply, { isCritical });
    }

    update() {
        if (this.activationDelay.walk()) {
            this.triggered = !this.triggered;
            if (!this.triggered) {
                this.hitTimer.reset();
            }
            this.draw(this.triggered ? "#B71C1C" : "#FFFFFF");
        }

        if (this.hitTimer.isStarted && !this.hitTimer.walk()) {
            return;
        }

        if (boxesIntersect(this.actor, this.target) && this.triggered) {
            this.hit();
        }
    }
}

ScriptBehavior.define("DamageAreaBehavior", DamageAreaBehavior);
