// Import Third-party Dependencies
import * as PIXI from "pixi.js";

// Import Internal Dependencies
import * as Easing from "./easing";
import ProgressiveNumber from "./progressiveNumber";
import Timer from "./timer.class";

export default class Fade {
    /**
     * @param {!PIXI.DisplayObject} displayObject
     * @param {object} options
     * @param {number} [options.frame=120]
     * @param {keyof Easing} [options.easing="easeInSine"]
     * @param {"in" | "out"} [options.defaultState = "in"]
     * @param {number} [options.delayIn]
     * @param {number} [options.delayOut]
     */
    constructor(displayObject, options = {}) {
        const { frame, easing, defaultState = "out", delayIn = null, delayOut = null } = options;

        this.displayObject = displayObject;
        this.displayObject.alpha = defaultState === "out" ? 0 : 1;
        this.delayTimer = null;
        this.delayIn = delayIn;
        this.delayOut = delayOut;
        this.callback = null;

        this.innerFadePn = new ProgressiveNumber(0, 1, {
            frame, easing, reverse: defaultState === "in"
        });
    }

    auto(callback = null) {
        const currentState = this.state;
        const autoCallback = callback === null ? null : () => {
            callback();
            this[currentState]();
        }

        if (currentState === "out") {
            this.in(autoCallback);
        }
        else {
            this.out(autoCallback);
        }
    }

    out(callback = null) {
        if (this.state === "out") {
            return;
        }

        if (this.delayOut !== null) {
            this.delayTimer = new Timer(this.delayOut, { autoStart: true, keepIterating: false });
        }
        this.callback = callback;
        this.displayObject.alpha = 0;
        this.innerFadePn.revert(false);
    }

    in(callback = null) {
        if (this.state === "in") {
            return;
        }

        if (this.delayIn !== null) {
            this.delayTimer = new Timer(this.delayIn, { autoStart: true, keepIterating: false });
        }
        this.callback = callback;
        this.displayObject.alpha = 1;
        this.innerFadePn.revert(true);
    }

    get state() {
        return this.innerFadePn.reverted ? "in" : "out";
    }

    autoUpdate() {
        this.displayObject.on("update", this.update.bind(this));

        return this;
    }

    update() {
        const hasDelayTimer = this.delayTimer !== null;
        if (hasDelayTimer && !this.delayTimer.walk()) {
            return;
        }

        if (hasDelayTimer) {
            this.delayTimer = null;
        }

        const alpha = this.innerFadePn.walk(false);
        this.displayObject.alpha = alpha;

        if (this.callback !== null) {
            if (this.state === "out" && alpha >= 1 || this.state === "in" && alpha <= 0) {
                if (typeof this.callback === "function") {
                    this.callback();
                }
                this.callback = null;
            }
        }
    }
}
