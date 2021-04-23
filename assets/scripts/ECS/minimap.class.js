// Import third-party Dependencies
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

export default class Minimap extends PIXI.Container {
    /**
     *
     * @param {object} options
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {PIXI.InteractionManager} [options.interaction] InteractionManager, available from instantiated PIXI.Renderer.plugins.interaction - used to calculate pointer postion relative to canvas location on screen
     */
    constructor(options = {}) {
        super();
        this.width = options.width || 500;
        this.height = options.height || 400;

        this.content = this.addChild(
            new Viewport({

                screenWidth: this.width,
                screenHeight: this.height,
                interaction: options.interaction
            })
        );
        this.content.decelerate();
        this.content.zoomPercent(1);
        this.interactive = true;

        this._maskContent = this.addChild(new PIXI.Graphics());
        this._drawMask();
    }

    _drawMask() {
        this._maskContent
            .beginFill(0)
            .drawRect(0, 0, this.width, this.height)
            .endFill();
        this.content.mask = this._maskContent;
    }

    update() {
        this.content.mask = null;
        this._maskContent.clear();
        this._drawMask();
    }
}
