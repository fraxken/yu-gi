// Import dependencies
import { ScriptBehavior, getActor, hitTestRectangle } from "../ECS";

import { Inputs } from "../keys";

export default class StoneBehavior extends ScriptBehavior {
    constructor() {
        super({
            enabled: "dungeon.enabled"
        });
    }

    start() {
        this.target = getActor("player");
        this.stoneControl = getActor("stoneControl");
    }

    activateStone() {
        this.stoneControl.getScriptedBehavior("StoneControlBehavior").sendMessage("activateStone", this.actor.name);
    }

    update() {
        if (this.enabled) {
            return;
        }

        if (Inputs.use() && hitTestRectangle(this.actor, this.target)) {
            this.activateStone();
        }
    }
}

ScriptBehavior.define("StoneBehavior", StoneBehavior);
