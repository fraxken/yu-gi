import Timer from "./timer.class";
import * as Easing from "./easing";

export default class ProgressiveNumber {
    /**
     * @param {!number} min
     * @param {!number} max
     * @param {object} options
     * @param {number} [options.frame=60]
     * @param {keyof Easing} [options.easing="linearTween"]
     */
    constructor(min, max, options = {}) {
        if (max <= min) {
            throw new Error("max must be an higher value than min!");
        }
        const { frame = 60, easing = "linearTween" } = options;

        this.timer = new Timer(frame, { autoStart: true, keepIterating: false });
        this.min = min;
        this.max = max;
        this.dx = this.max - this.min;
        this.easing = easing;
    }

    /**
     * @param {boolean} [reset=true]
     * @returns {number}
     */
    walk(reset = true) {
        if (reset) {
            this.timer.reset();

            return this.min;
        }

        if (this.timer.upTick()) {
            const progression = this.timer.progression(this.easing);

            return this.min + this.dx * progression;
        }

        return this.min;
    }
}
