import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components } from "../ECS";

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true });

        const map = new Actor("map");
        map.visible = true;
        map.addComponent(new Components.TiledMap("map1"));
        this.add(map);

        this.add(EntityBuilder.create("actor:player"));
        this.add(...EntityBuilder.createMany("actor:creature", 5));
        this.add(EntityBuilder.create("sound:3D"));
    }

    awake() {
        super.awake();

        console.log("Default Scene Awake");
    }
}

Scene.define("default", DefaultScene);
