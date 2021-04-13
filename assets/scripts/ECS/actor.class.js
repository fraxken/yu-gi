// Import dependencies
import * as PIXI from "pixi.js";
import Behavior from "./scriptbehavior.js";
import ActorTree from "./actortree.class";
import AnimatedSpriteEx from "./animatedsprite.class";
import * as Component from "./component.js";

export default class Actor extends ActorTree {
    /**
     * @param {!string} name
     */
    constructor(name) {
        super();
        this.destroyed = false;
        this.name = name;

        // Velocity properties
        this.vx = 0;
        this.vy = 0;

        /** @type {PIXI.Sprite | PIXI.AnimatedSprite | AnimatedSpriteEx} */
        this.sprite = null;

        /** @type {Behavior[]} */
        this.behaviors = [];

        /** @type {(AnimatedSpriteEx | PIXI.Sprite | PIXI.AnimatedSprite)[]} */
        this.components = [];

        this.on("destroy", this.cleanup.bind(this));
    }

    cleanup() {
        if (this.sprite) {
            this.sprite.destroy();
        }
        this.destroy();
        this.destroyed = true;
    }

    /**
     * @param {number} [x=0]
     */
    moveX(x = 0) {
        this.vx += x;
    }

    /**
     * @param {number} [y=0]
     */
    moveY(y = 0) {
        this.vy += y;
    }

    get moving() {
        return this.vx !== 0 || this.vy !== 0;
    }

    applyVelocity() {
        if (!this.moving) {
            return;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx = 0;
        this.vy = 0;
    }

    /**
     * @param {AnimatedSpriteEx | PIXI.Sprite | PIXI.AnimatedSprite} component
     */
    addComponent(component) {
        Component.isComponent(component);
        component.linkActorToComponent(this);
        this.components.push(component);
        this.addChild(component);

        return component;
    }

    /**
     * @param {keyof Component.Types} type
     * @returns {AnimatedSpriteEx | PIXI.Sprite | PIXI.AnimatedSprite}
     */
    getComponent(type) {
        return this.components.find((comp) => Component.type(comp) === type);
    }

    /**
     * @param {keyof Component.Types} type
     * @returns {(AnimatedSpriteEx | PIXI.Sprite | PIXI.AnimatedSprite)[]}
     */
    getAllComponent(type) {
        return this.components.filter((comp) => Component.type(comp) === type);
    }

    /**
     * @method addScriptedBehavior
     * @param {Behavior} scriptInstance
     * @returns
     */
    createScriptedBehavior(scriptInstance, ...options) {
        if (typeof scriptInstance === "string") {
            const classInstance = Behavior.cache.get(scriptInstance);
            scriptInstance = new classInstance(...options);
        }
        scriptInstance.actor = this;
        this.behaviors.push(scriptInstance);

        return this;
    }

    /**
     * @param {!string} name
     * @returns {Behavior | undefined}
     */
    getScriptedBehavior(name) {
        return this.behaviors.find((object) => object.constructor.name === name);
    }

    /**
     * @method sendMessage
     * @param {!string} name
     * @param {object} options
     * @param {string[]} [options.scripts]
     * @param  {...any} args
     * @returns {void}
     */
    sendMessage(name, options = {}, ...args) {
        const toBehaviors = new Set(options.scripts || []);

        for (const behavior of this.behaviors) {
            if (toBehaviors.size === 0 || toBehaviors.has(behavior.constructor.name)) {
                behavior.sendMessage(name, ...args);
            }
        }
    }

    /**
     * @method triggerBehaviorEvent
     * @param {"awake" | "start" | "destroy" | "update"} eventName
     * @param  {...any} args
     * @returns {void}
     */
    triggerBehaviorEvent(eventName, ...args) {
        if (!this.destroyed) {
            for (const behavior of this.behaviors) {
                behavior[eventName](...args);
            }
        }
    }
}
