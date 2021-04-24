// Import dependencies
// import * as PIXI from "pixi.js";
import Actor from "./actor.class";
import ActorTree from "./actortree.class";
import Engine from "./engine.class";

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
     * @param {boolean} [options.debug=false]
     */
    constructor(options = {}) {
        super({
            useLRUCache: options.useLRUCache || true
        });

        this.name = this.constructor.name;
        this.awakened = false;
        this.started = false;
        this.destroyed = false;
        this.debug = options.debug || false;
        this.isUpdated = false;

        /** @type {Scene[]} */
        this.childScenes = [];

        if (this.debug) {
            console.log(`[INFO] New scene '${this.name}' instanciated!`);
        }
    }

    /**
     * @param {Engine} [controller]
     */
    init(controller = null) {
        this.awake();
        if (controller !== null) {
            controller.emit("awake");
        }
        this.start();
        if (controller !== null) {
            controller.emit("start");
        }

        // this.setupUpdateTick();
    }

    setupUpdateTick() {
        if (this.isUpdated){
            return;
        }

        this.isUpdated = true;
        game.app.ticker.add(this.update.bind(this));
    }

    /**
     * @param {...(Actor | Scene)} entities
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
                this.childScenes.push(entity);
                this.addChild(entity);
                if (this.awakened) {
                    entity.init(null);
                }

                return entity;
            }
        }

        return this;
    }

    awake() {
        if (this.debug)  {
            console.log(`[INFO] Scene '${this.name}' awake phase started!`);
        }

        for (const child of this.childScenes) {
            child.awake();
        }
        this.emitEventForAllActors("awake");
        this.awakened = true;
        if (this.debug)  {
            console.log(`[INFO] Scene '${this.name}' awake phase ended!`);
        }

        return this;
    }

    start() {
        if (this.debug)  {
            console.log(`[INFO] Scene '${this.name}' start phase started!`);
        }

        for (const child of this.childScenes) {
            child.start();
        }
        this.emitEventForAllActors("start");
        this.started = true;
        if (this.debug)  {
            console.log(`[INFO] Scene '${this.name}' start phase ended!`);
        }
        for (const child of this.childScenes) {
            child.setupUpdateTick();
        }

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
        if (this.debug)  {
            console.log(`[WARN] Scene '${this.name}' cleanup triggered!`);
        }

        for (const child of this.childScenes) {
            child.cleanup();
        }

        game.app.ticker.remove(this.update.bind(this));
        this.cleanupTree();
        this.destroy({ children: true });
        this.destroyed = true;
    }
}
