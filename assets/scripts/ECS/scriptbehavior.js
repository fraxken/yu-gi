// Import dependencies
import * as PIXI from "pixi.js";
import Actor from "./actor.class";
import { getCurrentState } from "./helpers";

const voidFunction = () => undefined;

export default class ScriptBehavior extends PIXI.utils.EventEmitter {
    constructor() {
        super();
        /** @type {Actor} */
        this.actor = null;

        for (const methodName of ScriptBehavior.AvailableMethods) {
            if (typeof this[methodName] !== "function") {
                this[methodName] = voidFunction();
            }
        }
    }

    get hasVelocity() {
        return this.actor.vx !== 0 || this.actor.vy !== 0;
    }

    get sprite() {
        return this.actor.sprite;
    }

    get pos() {
        return { x: this.actor.x, y: this.actor.y };
    }

    stateConfiguration(config = {}) {
        getCurrentState().attachToBehavior(this, config);
    }

    /**
     * @param {!string} name 
     * @param  {...any} args 
     */
    sendMessage(name, ...args) {
        if (typeof this[name] === "function") {
            this[name](...args);
            this.emit(name, ...args);
        }
    }
}

ScriptBehavior.AvailableMethods = new Set(["awake", "update", "destroy"]);

