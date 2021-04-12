// Import dependencies
// import * as PIXI from "pixi.js";
import Actor from "./actor.class";
import ActorTree from "./actortree.class";

export default class Scene extends ActorTree {
    constructor(sceneInitor, options = {}) {
        super({
            useLRUCache: options.useLRUCache || true
        });
        this.awakened = false;
        this.started = false;
        this.destroyed = false;
        
        this.sceneInitor = sceneInitor;
        this.sceneInitor.init(this);
    }

    /**
     * @param {!Actor | Scene} entity 
     * @returns 
     */
    add(entity) {
        if (entity instanceof Actor) {
            this.appendActor(entity);
            if (this.awakened) {
                entity.triggerBehaviorEvent("awake");
            }
        }
        else if (entity instanceof Scene) {
            console.log("[DEBUG] ADD SCENE NOT IMPLEMENTED YET!");
        }

        return this;
    }

    awake() {
        this.sceneInitor.awake(this);
        this.emitEventForAllActors("awake");
        this.awakened = true;

        return this;
    }

    start() {
        this.sceneInitor.start(this);
        this.emitEventForAllActors("start");
        this.started = true;

        return this;
    }

    update(delta) {
        if (this.destroyed) {
            return;
        }

        this.sceneInitor.update(this);
        this.emitEventForAllActors("update", delta);
    }

    cleanup() {
        this.cleanupTree();
        this.destroy({ children: true });
        this.destroyed = true;
    }
}