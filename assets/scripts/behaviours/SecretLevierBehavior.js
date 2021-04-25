// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
import { Inputs } from "../keys";

export default class SecretLevierBehavior extends ScriptBehavior {
    static DistanceToTrigger = 60;

    awake() {
        this.triggered = false;
    }

    start() {
        this.target = getActor("player");
    }

    trigger() {
        console.log("levier triggered!");
        game.rootScene.setSecretRoomDoors("unlock");
    }

    update() {
        if (this.triggered) {
            return;
        }

        if (Inputs.use() && this.actor.pos.distanceTo(this.target.pos) < SecretLevierBehavior.DistanceToTrigger) {
            this.trigger();
        }
    }
}

ScriptBehavior.define("SecretLevierBehavior", SecretLevierBehavior);
