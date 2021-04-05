// Import dependencies
import * as PIXI from "pixi.js";

export default class Behavior extends PIXI.utils.EventEmitter {
    constructor(actor) {
        super();
        this.actor = actor;

        this.on("start", () => this.start());
        this.on("update", () => this.update());
    }
}
