// Import dependencies
import * as PIXI from "pixi.js";
import Behavior from "./behavior.class.js";

export default class Actor extends PIXI.DisplayObject {
    constructor(name, parent = null) {
        super();

        this.name = name;
        if (parent !== null) {
            parent.addChild(this);
        }

        /** @type {Behavior[]} */
        this.behaviors = [];
    }

    registerBehavior(behaviorObject) {
        this.behaviors.push(new behaviorObject(this));

        return this;
    }

    dispatchEvent(eventName) {
        for (const behavior of this.behaviors) {
            behavior.emit(eventName);
        }
    }
}
