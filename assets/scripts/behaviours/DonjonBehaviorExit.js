// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
import { Inputs } from "../keys";

export default class DonjonBehaviorExit extends ScriptBehavior {
    DistanceToExit = 100;

    constructor() {
        super();
        this.teleporting = false;
    }

    start() {
        this.target = getActor("player");
    }

    warp() {
        this.teleporting = true;

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        script.sendMessage("exitDungeon", true);
    }

    update() {
        if (this.teleporting) {
            return;
        }

        if (Inputs.use() && this.actor.pos.distanceTo(this.target.pos) < DonjonBehaviorExit.DistanceToExit) {
            this.warp();
        }
    }
}

ScriptBehavior.define("DonjonBehaviorExit", DonjonBehaviorExit);
