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
}

ScriptBehavior.AvailableMethods = new Set(["awake", "update", "destroy"]);

