// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset } from "./helpers";

export default class AnimatedSpriteEx extends PIXI.AnimatedSprite {
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

        this.animationSpeed = animationSpeed;
        this.play();

        this.spritesheet = spritesheet;
        this.defaultAnimation = defaultAnimation;
        this.currentAnimationName = defaultAnimation;screenTop

        // Center anchor
        this.anchor.set(0.5, 0.5);
    }

    reset() {
        this.playAnimation(this.defaultAnimation);
    }

    playAnimation(animationName, options = {}) {
        const { loop = true } = options

        const isCurrentAnimation = this.currentAnimationName === animationName
        const isPlayingWithoutLoop = this.loop === false && this.playing
        if (isCurrentAnimation || isPlayingWithoutLoop) {
            return;
        }

        this.currentAnimationName = animationName;
        this.textures = this.spritesheet.animations[animationName];
        this.loop = loop
        this.play();
    }
}
