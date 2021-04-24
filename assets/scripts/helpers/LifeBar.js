// Import dependencies
import * as PIXI from "pixi.js";


export default class LifeBar {
    container = new PIXI.Container();

    /**
     * @param {object} [options]
     * @param {number} [options.spriteHeight]
     * @param {number} [options.relativeMaxHp]
     * @param {number} [options.currentHp]
     */
    constructor(options = {}) {
        this.kMaxHpBarLength = 100;
        this.kMaxHpBarX = -(this.kMaxHpBarLength - (this.kMaxHpBarLength / 2));
        this.kMaxHpBarY = -(options.spriteHeight + 10);
        this.ratio = this.kMaxHpBarLength / options.relativeMaxHp;

        this.maxHpBar = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#666"), 1)
            .drawRect(this.kMaxHpBarX, this.kMaxHpBarY, this.kMaxHpBarLength, 10)
            .endFill();

        const currentHpBar = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("FF0000"), 1)
            .drawRect(this.kMaxHpBarX, this.kMaxHpBarY, options.currentHp * this.ratio, 10)
            .endFill();

        this.maxHpBar.addChild(currentHpBar);
        this.container.addChild(this.maxHpBar);

        return this;
    }

    /**
     * @param {number} [currentHp]
     *
     */
    update(currentHp) {
        this.maxHpBar.children[0].clear()
            .beginFill(PIXI.utils.string2hex("#FF0000"), 1)
            .drawRect(this.kMaxHpBarX, this.kMaxHpBarY, currentHp * this.ratio, 10)
            .endFill();

        return this;
    }
}
