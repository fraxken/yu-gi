// Import Internal Dependencies
import * as Easing from "./easing";

export default class Timer {
    static AutoStart = true;
    static KeepIterating = true;

    /**
     * @constructor
     * @param {number} [tickInterval=60]
     * @param {object} [options]
     * @param {boolean} [options.autoStart]
     * @param {boolean} [options.keepIterating]
     */
    constructor(tickInterval = 60, options = {}) {
        const { autoStart = Timer.AutoStart, keepIterating = Timer.KeepIterating, callback = null } = options;

        this.tickInterval = tickInterval;
        this.isStarted = autoStart;
        this.defaultStarted = autoStart;
        this.keepIterating = keepIterating;
        this.callback = callback;
        this.tick = 0;
    }

    /**
     * @param {keyof Easing} easingName
     * @param {number} [start=0]
     * @param {number} [end=0]
     * @returns {number}
     */
    progression(easingName, start = 0, end = 1) {
        return Easing[easingName](this.tick, start, end, this.tickInterval);
    }

    upTick() {
        if (this.tick === this.tickInterval) {
            return true;
        }

        this.tick++;

        return this.tick <= this.tickInterval;
    }

    start() {
        this.isStarted = true;

        return this;
    }

    reset() {
        this.isStarted = this.defaultStarted;
        this.tick = 0;

        return this;
    }

    walk() {
        if (!this.isStarted) {
            return false;
        }

        if (this.tick < this.tickInterval) {
            this.tick++;
            return false;
        }

        if (!this.keepIterating) {
            this.isStarted = false;
        }

        this.tick = 0;
        if (this.callback !== null) {
            this.callback();
        }
        return true;
    }
}
