// Import third-party Dependencies
import * as PIXI from "pixi.js";

// Import internal Dependencies
import { Timer } from "../ECS";

export default class TextAnimation {
    /**
     * @param {!string} text
     * @param {!PIXI.TextStyle} style
     * @param {*} options
     */
    constructor(text, style, options = {}) {
        this.text = text;
        this.style = style;

        this.autoDestroy = options.autoDestroy || false;
        this.animations = options.animations || [];

        this.textAsset = new PIXI.Text(text, style);
    }

    destroy() {

    }

    update() {

    }
}
