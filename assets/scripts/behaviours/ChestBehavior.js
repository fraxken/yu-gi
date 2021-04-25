// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
import { Inputs } from "../keys";

export default class ChestBehavior extends ScriptBehavior {
    static DistanceToOpen = 60;

    awake() {
        this.items = [];
        this.open = false;
        this.destroyOnClose = false;
    }

    start() {
        this.target = getActor("player");
    }

    open() {
        this.open = true;
        hudevents.emit("chest_open", this);
    }

    close() {
        this.open = false;
        if (this.destroyOnClose) {
            this.actor.cleanup();
        }
    }

    update() {
        if (this.open) {
            return;
        }

        if (Inputs.use() && this.actor.pos.distanceTo(this.target.pos) < ChestBehavior.DistanceToOpen) {
            this.warp();
        }
    }
}

ScriptBehavior.define("ChestBehavior", ChestBehavior);
