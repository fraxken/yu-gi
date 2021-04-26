// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
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
            const test = new Card("First Card", "sword", "shieldParry", "attackDamageBoost", "healthUp", 1)

            this.cards.push(test);
        }

        this.opened = false;
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

        if (Inputs.use() && !this.opened && inArea) {
            this.open();
        }
        else if (this.opened && (!inArea || Inputs.escape())) {
            this.close();
        }
    }
}

ScriptBehavior.define("ChestBehavior", ChestBehavior);
