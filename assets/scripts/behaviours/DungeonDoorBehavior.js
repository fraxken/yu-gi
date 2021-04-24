// Import dependencies
import { ScriptBehavior, getActor, Timer } from "../ECS";
import { Key } from "../helpers";
import { Inputs } from "../keys";

export default class DungeonDoorBehavior extends ScriptBehavior {
    awake() {
        this.warpTimer = new Timer(30, { autoStart: false, keepIterating: false });
    }

    start() {
        this.target = getActor("player");
    }

    warp() {
        this.warpTimer.start();

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        const pos = this.actor.connectedTo.pos;

        script.sendMessage("teleport", {
            x: pos.x + (this.actor.connectedTo.width / 4),
            y: pos.y + (this.actor.connectedTo.height / 2)
        });
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

ScriptBehavior.define("DungeonDoorBehavior", DungeonDoorBehavior);
