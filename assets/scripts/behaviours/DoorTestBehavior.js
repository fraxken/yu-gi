// Import dependencies
import { ScriptBehavior, getActor, Timer } from "../ECS";

import { Inputs } from "../keys";

export default class DoorTestBehavior extends ScriptBehavior {
    awake() {
        this.warpTimer = new Timer(30, { autoStart: false, keepIterating: false });
    }

    start() {
        this.target = getActor("player");
    }

    warp() {
        this.warpTimer.start();

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        const connectedTo = this.actor.connectedTo;

        // const globalX = this.actor.connectedTo.worldTransform[2];
        // const globalY = this.actor.connectedTo.worldTransform[5];
        // script.sendMessage("teleport", { x: globalX + (connectedTo.width / 2), y: globalY + (connectedTo.height / 2) });
    }

    update() {
        if (this.warpTimer.isStarted && !this.warpTimer.walk()) {
            return;
        }

        const distance = this.actor.pos.distanceTo(this.target.pos);
        if (distance < 50 && Inputs.use()) {
            this.warp();
        }
    }
}

ScriptBehavior.define("DoorTestBehavior", DoorTestBehavior);
