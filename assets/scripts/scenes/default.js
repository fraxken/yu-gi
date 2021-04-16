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
        this.add(EntityBuilder.create("actor:projectile", { startPos: { x: 10, y: 10 }, targetPos: { x: 100, y: 100 }}));
    }

    awake() {
        super.awake();

        console.log("Default Scene Awake");
    }
}

Scene.define("default", DefaultScene);
