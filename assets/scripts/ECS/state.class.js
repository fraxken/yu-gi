// Import dependencies
import * as PIXI from "pixi.js";
import clonedeep from "lodash.clonedeep";
import get from "lodash.get";
import set from "lodash.set";
import ScriptBehavior from "./scriptbehavior";

export default class State extends PIXI.utils.EventEmitter {
    /**
     * @param {!string} name
     * @param {*} defaultState
     */
    constructor(name, defaultState = {}) {
        super();
        if (typeof name !== "string") {
            throw new TypeError("name must be a string");
        }

        this.name = name;
        this.defaultState = clonedeep(defaultState);

        this.load();
    }

    load() {
        const stateStr = localStorage.getItem(`state:${this.name}`);

        this.data = stateStr === null ? clonedeep(this.defaultState) : JSON.parse(stateStr);
    }

    reset() {
        this.data = clonedeep(this.defaultState);
        this.save();
        this.emit("reset");
    }

    /**
     * @param {!string} key
     * @param {*} value
     */
    setState(key, value = null) {
        set(this.data, key, value);
        this.emit(key, value);
        this.save();
    }

    /**
     * @param {!string} key
     * @returns
     */
    getState(key) {
        return get(this.data, key);
    }

    /**
     *
     * @param {!ScriptBehavior} behavior
     * @param {*} config
     */
    attachToBehavior(behavior, config = {}) {
        if (typeof config === "undefined") {
            throw new TypeError("config must be set!");
        }

        for (const [behaviorKey, stateKey] of Object.entries(config)) {
            const defaultValue = behavior[behaviorKey] || null;
            const currentStateValue = this.getState(stateKey);
            this.setState(stateKey, currentStateValue || defaultValue);

            Object.defineProperty(behavior, behaviorKey, {
                get: () => this.getState(stateKey),
                set: (newValue) => {
                    this.setState(stateKey, newValue);
                }
            })
        }
    }

    save() {
        localStorage.setItem(`state:${this.name}`, JSON.stringify(this.data));
    }
}
