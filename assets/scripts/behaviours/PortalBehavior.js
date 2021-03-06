// Import dependencies
import { ScriptBehavior, getActor, boxesIntersect } from "../ECS";
import { Inputs } from "../keys";

export default class PortalBehavior extends ScriptBehavior {
    static DistanceToOpen = 50;

    constructor() {
        super();
        this.open = false;
        hudevents.on("picker", (value) => {
            this.open = value;
        });
    }

    start() {
        this.target = getActor("player");
    }

    destroy() {
        if (this.open) {
            hudevents.emit("picker", false);
        }
    }

    update() {
        const intersect = boxesIntersect(this.actor, this.target);
        if (Inputs.use() && !this.open && intersect) {
            hudevents.emit("picker", true);
            this.open = true;
        }
        else if (this.open && (!intersect || Inputs.escape())) {
            hudevents.emit("picker", false);
            this.open = false;
        }
    }
}

ScriptBehavior.define("PortalBehavior", PortalBehavior);
