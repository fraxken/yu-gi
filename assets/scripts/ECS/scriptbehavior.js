// Import dependencies
import * as PIXI from "pixi.js";
import Actor from "./actor.class";

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

    /**
     * @param {!string} propertyName 
     * @param {*} propertyValue 
     */
    updateProperty(propertyName, propertyValue = null) {
        this[propertyName] = propertyValue;
        this.emit(`property:${propertyName}`, propertyValue);
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

