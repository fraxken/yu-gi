// Import Third-party Dependencies
import * as PIXI from "pixi.js";

// Import Internal Dependencies
import * as Easing from "./easing";
import ProgressiveNumber from "./progressiveNumber";
import Timer from "./timer.class";
import Vector2 from "./vector2";

export default class Fade {
    /**
     * @param {!PIXI.DisplayObject} displayObject
     * @param {object} options
     * @param {number} [options.frame=120]
     * @param {keyof Easing} [options.easing="easeInSine"]
     * @param {"in" | "out"} [options.defaultState = "in"]
     * @param {number} [options.delayIn]
     * @param {number} [options.delayOut]
     * @param {boolean} [options.debug=false]
     */
    constructor(displayObject, options = {}) {
        const { frame, easing, defaultState = "out", delayIn = null, delayOut = null } = options;

        this.displayObject = displayObject;
        this.displayObject.alpha = defaultState === "out" ? 0 : 1;
        this.debug = options.debug || false;
        this.delayTimer = null;
        this.delayIn = delayIn;
        this.delayOut = delayOut;
        this.callback = null;
        this.defaultState = defaultState;

        this.innerFadePn = new ProgressiveNumber(0, 1, {
            frame, easing, reverse: defaultState === "in"
        });
    }

    reset() {
        this.displayObject.alpha = this.defaultState === "out" ? 0 : 1;
        this.innerFadePn.reset();
        this.delayTimer = null;
        this.callback = null;
    }

    /**
     * @param {!PIXI.ObservablePoint | Vector2}
     */
    set centerPosition(pos) {
        this.displayObject.position.set(
            pos.x - window.innerWidth / 2,
            pos.y - window.innerHeight / 2
        );
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
            return false;
        }

        if (hasDelayTimer) {
            this.delayTimer = null;
        }

        const alpha = this.innerFadePn.walk(false);
        this.displayObject.alpha = alpha;

        if (this.state === "out" && alpha >= 1 || this.state === "in" && alpha <= 0) {
            if (typeof this.callback === "function") {
                this.callback();
                this.callback = null;
            }

            return true;
        }

        return false;
    }
}
