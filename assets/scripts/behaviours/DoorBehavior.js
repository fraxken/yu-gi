// Import dependencies
import { ScriptBehavior, getActor, Timer } from "../ECS";
import { Key } from "../helpers";
// import { EntityBuilder, SpatialSound } from "../helpers";

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
        script.sendMessage("teleport", this.connectedTo.position);
    }

    update() {
        if (this.warpTimer.isStarted && !this.warpTimer.walk()) {
            return;
        }

        const distance = this.actor.pos.distanceTo(this.target.pos);
        if (distance < 50 && game.input.wasKeyJustPressed(Key.E)) {
            this.warp();
        }
    }
}

ScriptBehavior.define("DoorBehavior", DoorBehavior);
