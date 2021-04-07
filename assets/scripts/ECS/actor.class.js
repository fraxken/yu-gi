// Import dependencies
import * as PIXI from "pixi.js";
import Behavior from "./scriptbehavior.js";

export default class Actor extends PIXI.Container {
    constructor(name, parent = null) {
        super();

        this.vx = 0;
        this.vy = 0;
        this.sprite = null;
        this.destroyed = false;
        this.name = name;
        if (parent !== null) {
            parent.add(this);
        }

        /** @type {Actor[]} */
        this.childrens = [];
        /** @type {Behavior[]} */
        this.behaviors = [];

        this.on("destroy", () => {
            this.destroyed = true;
        });
    }

    moveX(x = 0) {
        this.vx += x;
    }

    moveY(y = 0) {
        this.vy += y;
    }

    getChildrenActorByName(name) {
        for (const actor of this.childrens) {
            if (actor.name === name) {
                return actor;
            }

            const childActor = actor.getChildrenActorByName(name);
            if (childActor !== null) {
                return childActor;
            }
        }

        return null;
    }

    addSprite(pixiSprite) {
        this.sprite = pixiSprite;
        this.addChild(this.sprite);
    }

    addScriptedBehavior(scriptInstance) {
        scriptInstance.actor = this;
        this.behaviors.push(scriptInstance);

        return this;
    }

    triggerBehaviorEvent(eventName, ...args) {
        for (const behavior of this.behaviors) {
            behavior[eventName](...args);
        }
    }
}
