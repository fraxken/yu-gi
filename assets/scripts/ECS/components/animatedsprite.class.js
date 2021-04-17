// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset } from "../helpers";
import * as Component from "../component";

export default class AnimatedSpriteEx extends PIXI.AnimatedSprite {
    /**
     * @param {!string[]} arr
     */
    static pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * @param {!string} spritesheetName
     * @param {!object} options
     * @param {number} [options.animationSpeed=0.1]
     * @param {string} [options.defaultAnimation]
     */
    constructor(spritesheetName, options = {}) {
        const { spritesheet } = findAsset(spritesheetName);
        const { animationSpeed = 0.1, defaultAnimation } = options;

        super(spritesheet.animations[defaultAnimation]);
        Component.assignSymbols(this);

        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.animationBook = new Map();
        this.locked = false;
        this.animationSpeed = animationSpeed;
        this.play();

        this.spritesheet = spritesheet;
        this.defaultAnimation = defaultAnimation;
        this.currentAnimationName = defaultAnimation;

        // Center anchor
        this.anchor.set(0.5, 0.5);
    }

    /**
     * @param {!string} newAnimationName
     * @param {!string[]} listOfAnimations
     */
    oneToMany(newAnimationName, listOfAnimations, pickFunction = AnimatedSpriteEx.pickRandom) {
        this.animationBook.set(newAnimationName, {
            listOfAnimations,
            pickOne: () => pickFunction(listOfAnimations)
        });

        return this;
    }

    reset() {
        this.unlock();
        this.playAnimation(this.defaultAnimation);

        return this;
    }

    lock() {
        this.locked = true;

        return this;
    }

    unlock() {
        this.locked = false;

        return this;
    }

    playAnimation(animationName, options = {}) {
        const { loop = true, force = false } = options
        if (this.locked && !force) {
            return;
        }

        const isCurrentAnimation = this.currentAnimationName === animationName;
        const isPlayingWithoutLoop = this.loop === false && this.playing;
        if (isCurrentAnimation || (isPlayingWithoutLoop && !force)) {
            return;
        }

        let newAnimationName = animationName;
        if (this.animationBook.has(animationName)) {
            newAnimationName = this.animationBook.get(animationName).pickOne();
        }

        this.currentAnimationName = animationName;
        this.textures = this.spritesheet.animations[newAnimationName];
        this.loop = loop;
        this.play();

        return this;
    }
}
