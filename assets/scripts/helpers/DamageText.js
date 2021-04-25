// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { Actor } from "../ECS";
import { AnimatedText, Animations, Key } from "./";

export function getStyle(color = "#EF5350", align = "center") {
    return {
        fill: color,
        fontFamily: "Verdana",
        fontSize: 8,
        fontVariant: "small-caps",
        fontWeight: "bold",
        letterSpacing: 1,
        lineJoin: "round",
        strokeThickness: 2,
        align
    }
}

export default class DamageText extends PIXI.utils.EventEmitter {
    /**
     * @param {!number} damage
     * @param {!Actor} parent
     * @param {object} [options]
     * @param {boolean} [options.isCritical]
     */
    constructor(damage, parent, options = {}) {
        super();
        this.isMiss = damage === 0;
        this.isCritical = !this.isMiss && (options.isCritical || false);
        this.decalY = -70;
        this.overCount = 0;

        if (this.isMiss) {
            this.text = new AnimatedText(`MISS`, getStyle("#7E57C2"), {
                autoDestroy: true,
                animations: [
                    new Animations.FadeTextAnimation({
                        frame: 30,
                        easing: "easeInQuad",
                        defaultState: "out"
                    }),
                    new Animations.MovingTextAnimation({
                        decalY: 40,
                        frame: 40,
                        easing: "easeOutQuad"
                    })
                ]
            });
            this.text.on("done", () => this.over());
            this.text.gameObject.anchor.set(0.5);
            this.text.position.set(0, this.decalY);
        }
        else {
            this.text = new AnimatedText(`${damage}`, getStyle(), {
                autoDestroy: true,
                animations: [
                    new Animations.FadeTextAnimation({
                        frame: 30,
                        easing: "easeInQuad",
                        defaultState: "out"
                    }),
                    new Animations.MovingTextAnimation({
                        decalY: 40,
                        frame: 40,
                        easing: "easeOutQuad"
                    })
                ]
            });
            this.text.on("done", () => this.over());
            this.text.gameObject.anchor.set(0.5);
            this.text.position.set(0, this.decalY);
        }

        if (this.isCritical) {

            this.criticalText = new AnimatedText(`CRITICAL`, getStyle("#FFEE58", "left"), {
                autoDestroy: true,
                animations: [
                    new Animations.FadeTextAnimation({
                        startAt: 5,
                        frame: 30,
                        easing: "easeInQuad",
                        defaultState: "out"
                    }),
                    new Animations.MovingTextAnimation({
                        decalY: 35,
                        frame: 45,
                        easing: "easeOutQuad"
                    })
                ]
            });
            this.criticalText.gameObject.anchor.set(0);
            this.criticalText.position.set(5, this.decalY);
            this.criticalText.on("done", () => this.over());
            parent.addChild(this.criticalText);
        }

        parent.addChild(this.text);
    }

    over() {
        this.overCount++;

        if (this.overCount === 1 && !this.isCritical) {
            this.emit("done");
        }
        else if (this.overCount === 2 && this.isCritical) {
            this.emit("done");
        }
    }

    update() {
        this.text.update();
        if (this.isCritical) {
            this.criticalText.update();
        }
    }
}
