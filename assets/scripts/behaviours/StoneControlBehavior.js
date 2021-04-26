// Import dependencies
import { Actor, ScriptBehavior, Timer } from "../ECS";

import { EntityBuilder } from "../helpers";

export default class StoneControlBehavior extends ScriptBehavior {
    awake() {
        /** @type {Set<Actor>} */
        this.stoneActors = new Set();
        this.stoneOrder = ["stele1", "stele2", "stele3"];
        this.currentOrder = [];
        this.allStonesHaveBeenActivated = game.state.getState("stoneEnabled");;
        this.activationTimer = new Timer(60 * 60, { autoStart: false, keepIterating: false });
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
            if (this.activationTimer.isStarted) {
                this.activationTimer.tick = 0;
            }
            else {
                this.activationTimer.start();
            }
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
        game.state.setState("stoneEnabled", true);
        this.allStonesHaveBeenActivated = true;
        for (const stoneActor of this.stoneActors) {
            const script = stoneActor.behaviors[0];
            script.sendMessage("retract");
        }
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
