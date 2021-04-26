// Import dependencies
import { ScriptBehavior, getActor, Components } from "../ECS";
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import { Card } from "../helpers/Deck/Card";
import { Inputs } from "../keys";

window.trunkCards = null;

export default class ChestBehavior extends ScriptBehavior {
    static DistanceToOpen = 60;

    static randomInt(max, min = 1) {
        return Math.floor(Math.random() * max) + min;
    }

    awake() {
        this.cards = [];
        const count = ChestBehavior.randomInt(Math.random() < 0.1 ? 3 : 2);
        for (let i = 0; i < count; i++) {
            const test = new Card("First Card", "sword", "shield", "attack", "heal", 1)

            this.cards.push(test);
        }

        this.opened = false;

        const spriteComponent = new Components.AnimatedSpriteEx("chest", {
            defaultAnimation: "idle"
        });
        spriteComponent.anchor.set(0, 0);

        /** @type {AnimatedSpriteEx} */
        this.sprite = this.actor.addComponent(spriteComponent);
        this.sprite.scale.set(0.5, 0.5);
    }

    start() {
        this.target = getActor("player");
    }

    destroy() {
        if (this.opened) {
            hudevents.emit("trunk", false);
        }
    }

    open() {
        window.trunkCards = this.cards;
        hudevents.emit("trunk", true);
        this.opened = true;
    }

    close() {
        hudevents.emit("trunk", false);
        this.opened = false;
        window.trunkCards = null;
    }

    update() {
        if (this.cards.length === 0) {
            this.actor.cleanup();
            hudevents.emit("trunk", false);
            return;
        }

        const distance = this.actor.pos.distanceTo(this.target.pos);
        const inArea = distance < ChestBehavior.DistanceToOpen;
        if (!this.opened && inArea) {
            this.sprite.playAnimation("open", { loop: false });

            if (Inputs.use()) {
                this.open();
            }
        }
        else if (this.opened && (!inArea || Inputs.escape())) {
            this.close();
        }
    }
}

ScriptBehavior.define("ChestBehavior", ChestBehavior);
