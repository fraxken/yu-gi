// Import dependencies
import * as PIXI from "pixi.js";


export default class LifeBar {
    container = new PIXI.Container();

    /**
     * @param {object} [options]
     * @param {number} [options.spriteHeight]
     * @param {number} [options.currentHp]
     * @param {number} [options.relativeMaxHp]
     * @param {number} [options.maxHpBarLength]
     */
    constructor(options = {}) {
        this.maxHpBarLength = options.maxHpBarLength;
        this.maxHpBarX = -(this.maxHpBarLength - (this.maxHpBarLength / 2));
        this.maxHpBarY = -(options.spriteHeight + 10);
        this.relativeMaxHp = options.relativeMaxHp;
        this.ratio = this.maxHpBarLength / this.relativeMaxHp;

        this.maxHpBar = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#666"), 1)
            .drawRect(this.maxHpBarX, this.maxHpBarY, this.maxHpBarLength, 10)
            .endFill();

        const currentHpBar = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("FF0000"), 1)
            .drawRect(this.maxHpBarX, this.maxHpBarY, options.currentHp * this.ratio, 10)
            .endFill();


        const textStyle = {
            fontFamily: "Arial",
            fontSize: 8,
            fill: "#FFF"
        };
        const hpTxt = new PIXI.Text(`${options.currentHp} / ${this.relativeMaxHp}`, { ...textStyle });
        hpTxt.x = this.maxHpBarX + (this.maxHpBarLength / 2) - 12;
        hpTxt.y = this.maxHpBarY;

        this.maxHpBar.addChild(currentHpBar);
        this.maxHpBar.addChild(hpTxt);
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
            .drawRect(this.maxHpBarX, this.maxHpBarY, currentHp * this.ratio, 10)
            .endFill();

        this.maxHpBar.children[1].text = `${currentHp} / ${this.relativeMaxHp}`;

        return this;
    }
}
