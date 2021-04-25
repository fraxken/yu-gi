// Import dependencies
import { Actor, ScriptBehavior, Timer } from "../ECS";

import { EntityBuilder } from "../helpers";

export default class StoneControlBehavior extends ScriptBehavior {
    constructor() {
        super({
            enabled: "dungeon.enabled"
        });
    }

    awake() {
        /** @type {Set<Actor>} */
        this.stoneActors = new Set();
        this.stoneOrder = ["stele2", "stele1", "stele3"];
        this.currentOrder = [];
        this.allStonesHaveBeenActivated = this.enabled;
        this.activationTimer = new Timer(60 * 10, { autoStart: false, keepIterating: false });
    }

    /**
     * @param {!Actor} stoneActor
     */
    registerStone(stoneActor) {
        this.stoneActors.add(stoneActor);
    }

    /**
     * @param {!string} name
     */
    activateStone(name) {
        this.currentOrder.push(name);
        if (this.currentOrder.length === this.stoneOrder.length) {
            this.checkSoneActivationOrder();
        }
        else {
            this.activationTimer.start();
        }
    }

    checkSoneActivationOrder() {
        for (let i = 0; i < 3; i++) {
            if (this.stoneOrder[i] !== this.currentOrder[i]) {
                this.disableAllStone();

                return;
            }
        }

        this.activationTimer.reset();
        this.enabled = true;
        this.allStonesHaveBeenActivated = true;
    }

    disableAllStone() {
        this.currentOrder = [];
        this.activationTimer.reset();

        for (const stoneActor of this.stoneActors) {
            const script = stoneActor.behaviors[0];
            script.sendMessage("disableStone");
        }
    }

    update() {
        if (this.allStonesHaveBeenActivated) {
            return;
        }

        if (this.activationTimer.isStarted && this.activationTimer.walk()) {
            this.disableAllStone();
        }
    }
}

ScriptBehavior.define("StoneControlBehavior", StoneControlBehavior);

EntityBuilder.define("actor:stoneControl", () => {
    return new Actor("stoneControl")
        .createScriptedBehavior("StoneControlBehavior");
});
