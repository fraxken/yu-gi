// Import dependencies
import * as PIXI from "pixi.js";
import clonedeep from "lodash.clonedeep";

export default class State extends PIXI.utils.EventEmitter {
    constructor(defaultState = {}) {
        super();

        this.defaultState = clonedeep(defaultState);
        this.innerState = clonedeep(defaultState);
    }

    reset() {
        this.innerState = clonedeep(this.defaultState);
        this.emit("reset");
    }

    setState(keyName, value = null) {
        this.innerState[keyName] = value;
        this.emit(keyName, value);
    }

    getState(keyName) {
        return this.innerState[keyName];
    }

    linkToBehavior(behavior) {}

    saveToLocalStorage() {

    }
}
