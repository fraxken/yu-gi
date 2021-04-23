// Import dependencies
import { ScriptBehavior, getActor, Timer, hitTestRectangle } from "../ECS";

import { Inputs } from "../keys";

export default class DoorBehavior extends ScriptBehavior {
    awake() {
        this.warpTimer = new Timer(30, { autoStart: false, keepIterating: false });
    }

    start() {
        this.target = getActor("player");
        this.connectedTo = getActor(this.actor.tileProperties.connectTo);
    }

    warp() {
        this.warpTimer.start();

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        script.sendMessage("teleport", this.connectedTo.centerPosition);
    }

    update() {
        if (this.warpTimer.isStarted && !this.warpTimer.walk()) {
            return;
        }

        if (Inputs.use() && hitTestRectangle(this.actor, this.target)) {
            this.warp();
        }
    }
}

ScriptBehavior.define("DoorBehavior", DoorBehavior);
