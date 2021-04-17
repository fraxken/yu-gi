// Import dependencies
// import * as PIXI from "pixi.js";
import Actor from "./actor.class";
import ActorTree from "./actortree.class";

export default class Scene extends ActorTree {
    /** @type {Map<string, Scene>} */
    static cache = new Map();

    /**
     * @param {!string} sceneName
     * @param {!Scene} classInstance
     */
    static define(sceneName, classInstance) {
        this.cache.set(sceneName, classInstance);
    }

    /**
     * @param {object} options
     * @param {boolean} [options.useLRUCache=true]
     */
    constructor(options = {}) {
        super({
            useLRUCache: options.useLRUCache || true
        });

        this.name = this.constructor.name;
        this.awakened = false;
        this.started = false;
        this.destroyed = false;

        console.log(`[INFO] New scene '${this.name}' instanciated!`);
    }

    /**
     * @param {...(Actor | Scene)} entities
     * @returns
     */
    add(...entities) {
        for (const entity of entities) {
            if (entity instanceof Actor) {
                this.appendActor(entity);
                if (this.awakened) {
                    entity.triggerBehaviorEvent("awake");
                }
            }
            else if (entity instanceof Scene) {
                console.log("[DEBUG] ADD SCENE NOT IMPLEMENTED YET!");
            }
        }

        return this;
    }

    awake() {
        this.emitEventForAllActors("awake");
        this.awakened = true;

        return this;
    }

    start() {
        this.emitEventForAllActors("start");
        this.started = true;

        return this;
    }

    update(delta) {
        if (this.destroyed) {
            return true;
        }
        this.emit("update");
        this.emitEventForAllActors("update", delta);

        return false;
    }

    cleanup() {
        this.cleanupTree();
        this.destroy({ children: true });
        this.destroyed = true;
    }
}
