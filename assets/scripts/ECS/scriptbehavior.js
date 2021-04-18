// Import dependencies
import * as PIXI from "pixi.js";
import Actor from "./actor.class";
import { getCurrentState } from "./helpers";

const voidFunction = () => void 0;

export default class ScriptBehavior extends PIXI.utils.EventEmitter {
    /** @type {Map<string, ScriptBehavior>} */
    static cache = new Map();

    /**
     * @param {!string} behaviorName
     * @param {!ScriptBehavior} classInstance
     */
    static define(behaviorName, classInstance) {
        this.cache.set(behaviorName, classInstance);
    }

    constructor(state = null) {
        super();
        /** @type {Actor} */
        this.actor = null;

        if (state !== null) {
            this.once("awake", () => {
                getCurrentState().attachToBehavior(this, state);
            });
        }

        for (const methodName of ScriptBehavior.AvailableMethods) {
            if (typeof this[methodName] !== "function") {
                this[methodName] = voidFunction;
            }
        }
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

ScriptBehavior.AvailableMethods = new Set(["awake", "start", "update", "destroy"]);

