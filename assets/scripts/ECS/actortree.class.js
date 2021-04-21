// Import internal dependencies
import * as PIXI from "pixi.js";
import Actor from "./actor.class";

// Import Third-party dependencies
import LRU from "lru-cache";

export default class ActorTree extends PIXI.Container {
    constructor(options = {}) {
        super();
        this.useLRUCache = options.useLRUCache || false;

        /** @type {LRU<string, Actor>} */
        this.actorsCache = this.useLRUCache ? new LRU({ max: 50 }) : null;

        /** @type {Map<string, Actor>} */
        this.actors = new Map();
    }

    cleanupTree() {
        for (const childrenActor of this.actors.values()) {
            childrenActor.triggerBehaviorEvent("destroy");
            childrenActor.cleanupTree();
        }

        this.emit("cleanup");
        this.emitEventForAllActors("destroy");
        this.actors.clear();
    }

    /**
     * @param {!Actor} actor
     */
    appendActor(actor) {
        this.actors.set(actor.name, actor);
        this.addChild(actor);
        this.emit("appendActor", actor);

        return this;

    }

    /**
     * @param {boolean} [recursive=false]
     * @returns {IterableIterator<Actor>}
     */
    *getActors(recursive = false) {
        for (const actor of this.actors.values()) {
            yield actor;
            if (recursive) {
                yield* actor.getActors(recursive);
            }
        }
    }

    /**
     *
     * @returns {IterableIterator<Actor>}
     */
    *getActorsFromComponents() {
        if (!this.components) {
            return;
        }

        /** @type {PIXI.Container[]} */
        const containers = this.components.filter((comp) => comp instanceof PIXI.Container);

        for (const container of containers) {
            if (container instanceof Actor) {
                yield* container.getActors(true);
                break;
            }

            for (const displayObject of container.children) {
                if (displayObject.constructor.name === "Actor") {
                    yield displayObject;
                }
            }
        }
    }

    /**
     * @param {!string} actorName
     * @param {boolean} [recursive=false]
     * @returns {null | Actor}
     */
    findChild(actorName, recursive = false) {
        if (this.actors.has(actorName)) {
            return this.actors.get(actorName);
        }
        else if (this.useLRUCache && this.actorsCache.has(actorName)) {
            return this.actorsCache.get(actorName);
        }

        for (const actor of this.getActorsFromComponents()) {
            if (actor.name === actorName) {
                if (this.useLRUCache) {
                    this.actorsCache.set(actorName, actor);
                }

                return actor;
            }
        }

        for (const actor of this.actors.values()) {
            const childActor = actor.findChild(actorName, recursive);
            if (childActor !== null) {
                if (this.useLRUCache) {
                    this.actorsCache.set(actorName, childActor);
                }

                return childActor;
            }
        }

        if (Array.isArray(this.childScenes))  {
            for (const scene of this.childScenes) {
                const actor = scene.findChild(actorName, recursive);
                if (actor !== null) {
                    return actor;
                }
            }
        }

        return null;
    }

    /**
     * @param {!string} eventName
     * @param  {...any} args
     */
    emitEventForAllActors(eventName, ...args) {
        for (const actor of this.getActorsFromComponents()) {
            actor.triggerBehaviorEvent(eventName, ...args);
        }

        for (const actor of this.actors.values()) {
            actor.triggerBehaviorEvent(eventName, ...args);
        }

        if (this.childScenes)  {
            for (const scene of this.childScenes) {
                scene.emitEventForAllActors(eventName, ...args);
            }
        }
    }
}
