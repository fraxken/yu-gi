// Import dependencies
import { ScriptBehavior, getActor, Timer } from "../ECS";
import { Inputs } from "../keys";

export default class DungeonDoorBehavior extends ScriptBehavior {
    static DistanceToActivateDoor = 60;

    awake() {
        this.warpTimer = new Timer(60, { autoStart: false, keepIterating: false });
    }

    start() {
        this.target = getActor("player");
    }

    warp() {
        this.warpTimer.start();
        console.log("warp triggered!");

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        const pos = this.actor.connectedTo.pos;

        // TODO: enhance teleportation position!
        script.sendMessage("fastTeleport", {
            x: pos.x + (this.actor.connectedTo.width / 4),
            y: pos.y + (this.actor.connectedTo.height / 2)
        });
    }

    update() {
        if (this.warpTimer.isStarted && !this.warpTimer.walk()) {
            return;
        }

        if (Inputs.use() && this.actor.pos.distanceTo(this.target.pos) < DungeonDoorBehavior.DistanceToActivateDoor) {
            this.warp();
        }
    }
}

ScriptBehavior.define("DungeonDoorBehavior", DungeonDoorBehavior);
