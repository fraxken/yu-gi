// Import dependencies
import * as PIXI from "pixi.js";
import Behavior from "./scriptbehavior.js";

export default class Actor extends PIXI.Container {
    constructor(name, parent = null) {
        super();

        // Velocity properties
        this.vx = 0;
        this.vy = 0;

        /** @type {PIXI.Sprite} */
        this.sprite = null;
        this.destroyed = false;
        this.name = name;
        if (parent !== null) {
            parent.add(this);
        }

        /** @type {Actor[]} */
        this.childrens = [];

        /** @type {Behavior[]} */
        this.behaviors = [];

        this.on("destroy", this.cleanup.bind(this));
    }

    cleanup() {
        // TODO: cleanup children actors
        if (this.sprite) {
            this.sprite.destroy();
        }
        this.destroy();
        this.destroyed = true;
    }

    moveX(x = 0) {
        this.vx += x;
    }

    moveY(y = 0) {
        this.vy += y;
    }

    getChildrenActorByName(name) {
        for (const actor of this.childrens) {
            if (actor.name === name) {
                return actor;
            }

            const childActor = actor.getChildrenActorByName(name);
            if (childActor !== null) {
                return childActor;
            }
        }

        return null;
    }

    addSprite(pixiSprite) {
        this.sprite = pixiSprite;
        this.addChild(this.sprite);
    }

    /**
     * @method addScriptedBehavior
     * @param {Behavior} scriptInstance 
     * @returns 
     */
    addScriptedBehavior(scriptInstance) {
        scriptInstance.actor = this;
        this.behaviors.push(scriptInstance);

        return this;
    }

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
     * @param {"awake" | "destroy" | "update"} eventName 
     * @param  {...any} args 
     * @returns {void}
     */
    triggerBehaviorEvent(eventName, ...args) {
        if (this.destroyed) {
            return;
        }

        for (const behavior of this.behaviors) {
            behavior[eventName](...args);

            if (eventName === "update") {
                this.x += this.vx;
                this.y += this.vy;
        
                this.vx = 0;
                this.vy = 0;
            }
        }
    }
}
