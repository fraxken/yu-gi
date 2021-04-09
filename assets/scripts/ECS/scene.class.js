// Import dependencies
import * as PIXI from "pixi.js";
import Actor from "./actor.class";

export default class Scene extends PIXI.Container {
    constructor() {
        super();

        /** @type {Actor[]} */
        this.actors = [];

        this.awakened = false;
        this.destroyed = false;
    }

    findActorByName(name, lookForActorChildrens = false) {
        for (const actor of this.actors) {
            if (actor.name === name) {
                return actor;
            }

            if (!lookForActorChildrens) {
                continue;
            }

            const actorChild = actor.getChildrenActorByName(name);
            if (actorChild !== null) {
                return actorChild;
            }
        }

        return null;
    }

    add(actor) {
        this.actors.push(actor);
        this.addChild(actor);
        if (this.awakened) {
            actor.triggerBehaviorEvent("awake");
        }

        return this;
    }

    awake() {
        this._emitForAllActors("awake");
        this.awakened = true;

        return this;
    }

    update(delta) {
        if (this.destroyed) {
            return;
        }

        this._emitForAllActors("update", delta);
    }

    cleanup() {
        this._emitForAllActors("destroy");
        this.destroy();
        this.actors = [];
        this.destroyed = true;
    }

    _emitForAllActors(eventName, ...args) {
        for (const actor of this.actors) {
            actor.triggerBehaviorEvent(eventName, ...args);
        }
    }
}