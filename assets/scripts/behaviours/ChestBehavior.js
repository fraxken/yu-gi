// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
import { Inputs } from "../keys";

export default class ChestBehavior extends ScriptBehavior {
    static DistanceToOpen = 60;

    awake() {
        this.cards = [];

        this.open = false;
        this.destroyOnClose = false;
    }

    start() {
        this.target = getActor("player");
    }

    remove() {
        this.actor.cleanup();
    }

    destroy() {
        if (this.open) {
            hudevents.emit("trunk", false);
        }
    }

    update() {
        const distance = this.actor.pos.distanceTo(this.target.pos);
        const inArea = distance < ChestBehavior.DistanceToOpen;

        if (Inputs.use() && !this.open && inArea) {
            hudevents.emit("trunk", true);
            this.open = true;
        }
        else if (this.open && !inArea) {
            hudevents.emit("trunk", false);
            this.open = false;

            if (this.destroyOnClose) {
                this.remove();
            }
        }
    }
}

ScriptBehavior.define("ChestBehavior", ChestBehavior);
