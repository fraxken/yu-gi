import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components } from "../ECS";

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true });

        this.add(EntityBuilder.create("actor:player"));
        this.add(...EntityBuilder.createMany("actor:creature", 5));

        const map = new Actor("map");
        map.addComponent(new Components.TiledMap("map1"));
        this.add(map);
    }

    awake() {
        super.awake();

        console.log("Default Scene Awake");
    }
}

Scene.define("default", DefaultScene);
