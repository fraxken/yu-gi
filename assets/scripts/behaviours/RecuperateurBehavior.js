import * as PIXI from "pixi.js";
import { Inputs } from "../keys";
import { ScriptBehavior, getActor } from "../ECS";

export default class RecuperateurBehavior extends ScriptBehavior {
    static DistanceToOpen = 60;

    constructor() {
        super();
        this.open = false;
    }

    awake() {
        const graphic = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#3E2723"), 0.6)
            .drawCircle(0, 0, 60)
            .endFill();

        this.actor.addChild(graphic);
    }

    start() {
        this.target = getActor("player");
    }

    update() {
        const distance = this.actor.pos.distanceTo(this.target.pos);
        const inArea = distance < RecuperateurBehavior.DistanceToOpen;

        if (Inputs.use() && !this.open && inArea) {
            hudevents.emit("recuperator", true);
            this.open = true;
        }
        else if (this.open && (!inArea || Inputs.escape())) {
            hudevents.emit("recuperator", false);
            this.open = false;
        }
    }

    destroy() {
        if (this.open) {
            hudevents.emit("recuperator", false);
        }
    }
}

ScriptBehavior.define("RecuperateurBehavior", RecuperateurBehavior);
