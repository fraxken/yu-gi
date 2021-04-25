
import { Inputs } from "../keys";
import { ScriptBehavior, Components, getActor } from "../ECS";

export default class PNJBehavior extends ScriptBehavior {
    static DistanceToOpen = 80;

    constructor(type = null) {
        super();

        // TODO: can be useful later if we have different kind of PNJ
        this.type = type;
        this.open = false;
    }

    awake() {
        this.sprite = this.actor.addComponent(
            new Components.AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );
    }

    start() {
        this.target = getActor("player");
    }

    update() {
        const distance = this.actor.pos.distanceTo(this.target.pos);
        if (Inputs.use() && !this.open && distance < PNJBehavior.DistanceToOpen) {
            hudevents.emit("store", true);
            this.open = true;
        }
        else if (this.open && distance > PNJBehavior.DistanceToOpen) {
            hudevents.emit("store", false);
            this.open = false;
        }
    }

    destroy() {
        if (this.open) {
            hudevents.emit("store", false);
        }
    }
}

ScriptBehavior.define("PNJBehavior", PNJBehavior);
