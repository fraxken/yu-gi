// Import dependencies
import { ScriptBehavior, getActor, Components } from "../ECS";
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import { Inputs } from "../keys";

export default class SecretLevierBehavior extends ScriptBehavior {
    static DistanceToTrigger = 60;

    awake() {
        this.triggered = false;
    }

    start() {
        this.target = getActor("player");

        const spriteComponent = new Components.AnimatedSpriteEx("stele", {
            defaultAnimation: "idle"
        });
        spriteComponent.anchor.set(0, 0);

        /** @type {AnimatedSpriteEx} */
        this.sprite = this.actor.addComponent(spriteComponent);
    }

    trigger() {
        this.sprite.playAnimation("activate", { loop: false, force: true });
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
