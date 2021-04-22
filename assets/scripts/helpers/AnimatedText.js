// Import third-party Dependencies
import * as PIXI from "pixi.js";

// Import internal Dependencies
import { Timer, Fade, Easing, ProgressiveNumber, Vector2 } from "../ECS";

class TextAnimation {
    init() {}
    update() {}
};

export class WritingTextAnimation extends TextAnimation {
    /**
     * @param {object} [options]
     * @param {number} [options.charTick=5]
     * @param {number} [options.pauseTimeBetweenLine=0]
     */
    constructor(options = {}) {
        super();

        this.charTick = options.charTick || 5;
        this.pauseTimeBetweenLine = options.pauseTimeBetweenLine || 0;
        this.pauseTimer = new Timer(this.pauseTimeBetweenLine, { autoStart: false, keepIterating: false });
        this.tick = 0;
        this.maxTextLength = 0;

        this._parent = null;
    }

    /**
     * @param {!AnimatedText} parent
     */
    init(parent) {
        this._parent = parent;
        this.maxTextLength = this._parent.gameObject.text.length;
        this._parent.gameObject.text = "";
    }

    reset() {
        this.tick = 0;
        this._parent.gameObject.text = "";
    }

    /**
     * @param {!string} text
     * @returns
     */
    spaceLength(text = null) {
        if (text === null || text === "") {
            return 0;
        }

        return text.length - text.trimLeft().length;
    }

    update() {
        if (this.pauseTimer.isStarted) {
            if (!this.pauseTimer.walk()) {
                return false;
            }

            this.pauseTimer.reset();
        }

        const sliceIndex = Math.floor(this.tick / this.charTick);
        if (sliceIndex > this.maxTextLength) {
            return true;
        }

        if (sliceIndex > this._parent.gameObject.text.length) {
            const slicedText = this._parent.textStr.slice(sliceIndex);
            const spaceCount = this.spaceLength(slicedText);

            this._parent.gameObject.text = this._parent.textStr.slice(0, sliceIndex) + " ".repeat(spaceCount);
            const isNewLine = slicedText.charAt(0) === "\n";
            if (this.pauseTimeBetweenLine > 0 && isNewLine) {
                this.pauseTimer.start();
            }
            this.tick += this.charTick * spaceCount;
        }
        this.tick++;

        return false;
    }
}

export class FadeTextAnimation extends TextAnimation {
    /**
     * @param {object} options
     * @param {number} [options.frame=120]
     * @param {keyof Easing} [options.easing="linearTween"]
     * @param {"in" | "out"} [options.defaultState = "in"]
     * @param {number} [options.delayIn]
     * @param {number} [options.delayOut]
     * @param {boolean} [options.debug]
     * @param {number} [options.startAt]
     */
    constructor(options = {}) {
        super();

        /** @type {Fade} */
        this.fade = null;
        this.fadeOptions = options;
        this.done = false;
        this.startAt = options.startAt || null;
        this.decalTimer = this.startAt !== null ? new Timer(this.startAt, { autoStart: true, keepIterating: false }) : null;
    }

    /**
     * @param {!AnimatedText} parent
     */
    init(parent) {
        this._parent = parent;
        this.fade = new Fade(this._parent.gameObject, this.fadeOptions);
    }

    reset() {
        this.done = false;
        if (this.decalTimer !== null) {
            this.decalTimer.reset();
        }
        this.fade.reset();
    }

    update() {
        if (this.decalTimer !== null && this.decalTimer.isStarted) {
            if (!this.decalTimer.walk()) {
                return false;
            }
        }

        if (this.done) {
            return true;
        }

        const state = this.fade.update();
        if (state) {
            this.done = true;
        }

        return state;
    }
}

export class MovingTextAnimation extends TextAnimation {
    /**
     * @param {object} options
     * @param {number} [options.decalX=0]
     * @param {number} [options.decalY=0]
     * @param {number} [options.frame=120]
     * @param {keyof Easing} [options.easing="linearTween"]
     */
    constructor(options = {}) {
        super();

        this.decalX = options.decalX || 0;
        this.decalY = options.decalY || 0;
        this.frame = options.frame;
        this.easing = options.easing || "linearTween";
        this.position = new Vector2(0, 0);
        this.target = new Vector2(this.decalX, this.decalY);
        this.done = false;

        this.pn = new ProgressiveNumber(0, 1, {
            frame: this.frame, easing: this.easing
        });
    }

    /**
     * @param {!AnimatedText} parent
     */
     init(parent) {
        this._parent = parent;

        const position = this._parent.gameObject.position;
        this.position = new Vector2(position.x, position.y);

        this._parent.gameObject.position.set(this.decalX, this.decalY);
    }

    reset() {
        this._parent.gameObject.position.set(this.decalX, this.decalY);
        this.pn.reset();
        this.done = false;
    }

    /**
     * @param {!number} progression
     * @returns {Vector2}
     */
    lerpPosition(progression) {
        return this.target.clone().lerp(this.position, progression);
    }

    update() {
        if (this.done) {
            return true;
        }

        const progression = this.pn.walk(false);
        if (progression === 1) {
            this.done = true;
            this._parent.gameObject.position.set(this.position.x, this.position.y);

            return true;
        }

        const warpPosition = this.lerpPosition(progression);
        this._parent.gameObject.position.set(warpPosition.x, warpPosition.y);

        return false;
    }
}

export default class AnimatedText extends PIXI.Container {
    /**
     * @param {!string} text
     * @param {!PIXI.TextStyle} style
     * @param {object} [options]
     * @param {boolean} [options.loop=false]
     * @param {boolean} [options.autoStart=true]
     * @param {boolean} [options.autoDestroy=false]
     * @param {boolean} [options.resetOnLinkedStop=false]
     * @param {boolean} [options.autoHide=false]
     * @param {TextAnimation[]} [options.animations]
     */
    constructor(text, style, options = {}) {
        super();
        this.textStr = text;
        this.textStyle = style;

        this.started = false;
        this.loop = options.loop || false;
        this.autoStart = typeof options.autoStart === "boolean" ? options.autoStart : true;
        this.autoDestroy = options.autoDestroy || false;
        this.resetOnLinkedStop = options.resetOnLinkedStop || false;
        this.autoHide = options.autoHide || false;
        this.animations = options.animations || [];

        /** @type {AnimatedText[]} */
        this.linked = [];
        /** @type {AnimatedText} */
        this.linkedFrom = null;
        this.linkedInitialized = false;

        if (this.loop && this.autoDestroy) {
            throw new Error("cannot use loop true in combinaison with autoDestroy");
        }

        /** @type {Set<string>} */
        this.animationsName = new Set();

        this.gameObject = new PIXI.Text(text, style);
        if (this.autoHide && !this.animationsName.has("FadeTextAnimation")) {
            this.gameObject.alpha = 0;
        }

        for (const animation of this.animations) {
            this.animationsName.add(animation.constructor.name);
            animation.init(this);
        }

        this.addChild(this.gameObject);
        if (this.autoStart) {
            this.start();
        }
    }

    /**
     * @param {!AnimatedText} animatedText
     */
    linkTo(animatedText) {
        this.linked.push(animatedText);
    }

    /**
     * @param {!AnimatedText} animatedText
     * @param {object} [options]
     * @param {boolean} [options.reset]
     * @param {boolean} [options.destroy]
     */
    linkFrom(animatedText, options = {}) {
        this.linkedFrom = animatedText;
        this.start();
        if (options.reset) {
            this.once("stop", () => animatedText.reset());
        }
    }

    destroy() {
        this.started = false;
        super.destroy({ children: true, baseTexture: true, texture: true });
    }

    start() {
        this.started = true;
        if (this.autoHide && !this.animationsName.has("FadeTextAnimation")) {
            this.gameObject.alpha = 1;
        }

        this.emit("start");
    }

    stop() {
        if (this.loop) {
            this.reset();
        }
        else {
            this.started = false;
        }

        if (!this.linkedInitialized) {
            for (const linkedAt of this.linked) {
                linkedAt.linkFrom(this, { reset: this.resetOnLinkedStop });
            }
            this.linkedInitialized = true;
        }
        this.emit("stop");
    }

    reset() {
        for (const animation of this.animations) {
            animation.reset();
        }
        this.started = this.autoStart;
    }

    update() {
        if (!this.started) {
            return;
        }

        let completed = 0;
        for (const animation of this.animations) {
            animation.update() && completed++;
        }
        if (completed < this.animations.length) {
            return;
        }

        if (this.autoDestroy) {
            return this.destroy();
        }

        this.stop();
    }
}
