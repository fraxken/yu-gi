// Import dependencies
import * as PIXI from "pixi.js";

const voidFunction = () => undefined;

export default class ScriptBehavior extends PIXI.utils.EventEmitter {
    constructor() {
        super();

        for (const methodName of ScriptBehavior.AvailableMethods) {
            if (typeof this[methodName] !== "function") {
                this[methodName] = voidFunction();
            }
        }
    }

    updateProperty(propertyName, propertyValue = null) {
        this[propertyName] = propertyValue;
        this.emit(`property:${propertyName}`, propertyValue);
    }

    sendMessage(name, ...args) {
        if (typeof this[name] === "function") {
            this[name](...args);
            this.emit(name, ...args);
        }
    }
}

ScriptBehavior.AvailableMethods = new Set(["awake", "update", "destroy"]);

