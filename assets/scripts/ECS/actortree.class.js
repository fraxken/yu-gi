// Import dependencies
import * as PIXI from "pixi.js";
import Actor from "./actor.class";

// Import Third-party
import LRU from "lru-cache";

export default class ActorTree extends PIXI.Container {
    constructor(options = {}) {
        super();
        this.useLRUCache = options.useLRUCache || false;

        /** @type {LRU<string, Actor>} */
        this.actorsCache = this.useLRUCache ? new LRU({ max: 10 }) : null;

        /** @type {Map<string, Actor>} */
        this.actors = new Map();
    }

    cleanupTree() {
        for (const childrenActor of this.actors.values()) {
            childrenActor.triggerBehaviorEvent("destroy");
            childrenActor.cleanupTree();
        }

        this.triggerBehaviorEvent("destroy");
        this.actors.clear();
    }

    /**
     * @param {!Actor} actor 
     */
    appendActor(actor) {
        this.actors.set(actor.name, actor);
        this.addChild(actor);

        return this;

    }

    /**
     * @param {!string} actorName 
     * @param {boolean} [lookForActorChildrens=false] 
     * @returns {null | Actor}
     */
    findActor(actorName, lookForActorChildrens = false) {
        if (this.actors.has(actorName)) {
            return this.actors.get(actorName);
        }
        else if (this.useLRUCache && this.actorsCache.has(actorName)) {
            return this.actorsCache.get(actorName);
        }
        else if (!lookForActorChildrens) {
            return null;
        }

        for (const actor of this.actors.values()) {
            const childActor = actor.findActor(actorName, lookForActorChildrens);
            if (childActor !== null) {
                if (this.useLRUCache) {
                    this.actorsCache.set(actorName, childActor);
                }

                return childActor;
            }
        }

        return null;
    }

    /**
     * @param {!string} eventName 
     * @param  {...any} args 
     */
    emitEventForAllActors(eventName, ...args) {
        for (const actor of this.actors.values()) {
            actor.triggerBehaviorEvent(eventName, ...args);
        }
    }
}
