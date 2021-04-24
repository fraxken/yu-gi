// Import dependencies
import { Actor, ScriptBehavior } from "../ECS";

import { EntityBuilder } from "../helpers";

export default class StoneControlBehavior extends ScriptBehavior {
    constructor() {
        super({
            enabled: "dungeon.enabled"
        });
    }

    awake() {
        this.activatedStone = new Map([
            ["stele1", false],
            ["stele2", false],
            ["stele3", false]
        ]);

        this.allStonesHaveBeenActivated = false;
    }

    activateStone(name) {
        console.log("Received message to activate", name);

        for (const key of this.activatedStone.keys()) {
            if (key !== name && this.activatedStone.get(key) === false) {
                return;
            }
            if (key === name) {
                this.activatedStone.set(key, true);
                return;
            }
        }
    }

    allStoneActivated() {
        for (const value of this.activatedStone.values()) {
            if (value === false) {
                return false;
            }
        }
        return true;
    }

    update() {
        if (!this.allStonesHaveBeenActivated && this.allStoneActivated()) {
            console.log("WELL PLAYED !!!");
            this.enabled = true;
            this.allStonesHaveBeenActivated = true;
        }
    }
}

ScriptBehavior.define("StoneControlBehavior", StoneControlBehavior);

EntityBuilder.define("actor:stoneControl", () => {
    return new Actor("stoneControl")
        .createScriptedBehavior("StoneControlBehavior");
});
