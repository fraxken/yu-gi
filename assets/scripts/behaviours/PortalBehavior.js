// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
import { Inputs } from "../keys";

export default class PortalBehavior extends ScriptBehavior {
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
        script.sendMessage("enterDungeon");
    }

    update() {
        if (this.teleporting) {
            return;
        }

        const distance = this.actor.pos.distanceTo(this.target.pos);
        if (distance < 50 && Inputs.use()) {
            this.warp();
        }
    }
}

ScriptBehavior.define("PortalBehavior", PortalBehavior);