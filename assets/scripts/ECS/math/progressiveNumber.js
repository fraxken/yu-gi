import Timer from "./timer.class";
import * as Easing from "./easing";

export default class ProgressiveNumber {
    /**
     * @param {!number} min
     * @param {!number} max
     * @param {object} options
     * @param {number} [options.frame=60]
     * @param {keyof Easing} [options.easing="linearTween"]
     * @param {boolean} [options.reverse = false]
     */
    constructor(min, max, options = {}) {
        if (max <= min) {
            throw new Error("max must be an higher value than min!");
        }
        const { frame = 60, easing = "linearTween", reverse = false } = options;

        this.timer = new Timer(frame, { autoStart: true, keepIterating: false });
        this.min = min;
        this.max = max;
        this.dx = this.max - this.min;
        this.easing = easing;

        this.defaultReverse = reverse;
        this.reverted = reverse;
    }

    reset() {
        this.revert(this.defaultReverse);
    }

    get baseValue() {
        return this.reverted ? this.max : this.min;
    }

    revert(newValue = !this.reverted) {
        this.reverted = newValue;
        this.timer.reset();
    }

    getProgression() {
        const progression = this.timer.progression(this.easing);
        const factor = this.reverted ? 1 - progression : progression;

        return this.min + this.dx * factor;
    }

    /**
     * @param {boolean} [reset=true]
     * @returns {number}
     */
    walk(reset = true) {
        if (reset) {
            this.timer.reset();

            return this.baseValue;
        }

        if (this.timer.upTick()) {
            return this.getProgression();
        }

        return this.baseValue;
    }
}
