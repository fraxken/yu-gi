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

