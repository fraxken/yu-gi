// Import dependencies
import * as PIXI from "pixi.js";
import Behavior from "./scriptbehavior.js";
import ActorTree from "./actortree.class";

import * as Component from "./component.js";

import AnimatedSpriteEx from "./components/animatedsprite.class";
import TiledMap from "./components/tiledmap.js";
import Vector2 from "./math/vector2";

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
        this.wasMoving = false;

        /** @type {PIXI.Sprite | PIXI.AnimatedSprite | AnimatedSpriteEx} */
        this.sprite = null;

        /** @type {TiledMap} */
        this.map = null;

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
        this.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
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
        return this.wasMoving || this.vx !== 0 || this.vy !== 0;
    }

    get pos() {
        return new Vector2(this.x, this.y);
    }

    /**
     * @param {Vector2} vec
     */
    set pos(vec) {
        this.position.set(vec.x, vec.y);
    }

    get centerPosition() {
        return new Vector2(this.x + (this.width / 2), this.y + (this.height / 2));
    }

    applyVelocity() {
        if (this.vx === 0 && this.vy === 0) {
            this.wasMoving = false;

            return;
        }

        if (this.vx !== 0 && this.vy !== 0) {
            this.vx = this.vx / 1.5;
            this.vy = this.vy / 1.5;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.wasMoving = true;

        // TODO: stop net or apply friction ?
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
            if (typeof classInstance === "undefined") {
                throw new Error(`Unable to found Behavior with name: ${scriptInstance}. Please make sure the script is exported in behaviours/index.js and well defined too!`);
            }
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
        if (this.destroyed) {
            return;
        }

        for (const actor of this.getActorsFromComponents()) {
            actor.triggerBehaviorEvent(eventName, ...args);
        }

        for (const behavior of this.behaviors) {
            behavior.triggerMethod(eventName, ...args);

            if (eventName === "awake") {
                behavior.awakened = true;
            }
            else if (eventName === "start") {
                if (!behavior.awakened) {
                    behavior.triggerMethod("awake");
                    behavior.awakened = true;
                }
                behavior.started = true;
            }
        }
    }
}
