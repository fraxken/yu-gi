// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
import { Inputs } from "../keys";

export default class BossBehavior extends ScriptBehavior {
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
        script.sendMessage("exitDungeon", false);
    }

    update() {
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

ScriptBehavior.define("BossBehavior", BossBehavior);
