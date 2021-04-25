// Import dependencies
import { ScriptBehavior, getActor, Timer } from "../ECS";
import { Inputs } from "../keys";

export default class DungeonDoorBehavior extends ScriptBehavior {
    static DistanceToActivateDoor = 60;

    constructor() {
        super();
        this.locked = false;
    }

    awake() {
        this.warpTimer = new Timer(60, { autoStart: false, keepIterating: false });
    }

    start() {
        this.target = getActor("player");

        const text = this.actor.children[0].children[0];
        text.text = this.actor.name;
    }

    lock() {
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

    warp() {
        this.warpTimer.start();

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        if (script.isTeleporting.isStarted) {
            return;
        }
        console.log("warp triggered!");
        const pos = this.actor.connectedTo.pos;

        // TODO: enhance teleportation position!
        this.actor.emit("player_leave");
        script.sendMessage("fastTeleport", {
            x: pos.x + (this.actor.connectedTo.width / 4),
            y: pos.y + (this.actor.connectedTo.height / 2)
        });
        this.actor.connectedTo.emit("player_enter");
    }

    update() {
        if (this.warpTimer.isStarted && !this.warpTimer.walk()) {
            return;
        }
        if (this.locked) {
            return;
        }

        if (Inputs.use() && this.actor.pos.distanceTo(this.target.pos) < DungeonDoorBehavior.DistanceToActivateDoor) {
            this.warp();
        }
    }
}

ScriptBehavior.define("DungeonDoorBehavior", DungeonDoorBehavior);
