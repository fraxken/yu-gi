import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components, Timer } from "../ECS";

const kHandicapForShooting = 120;

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: true });

        {
            const map = new Actor("map");
            map.visible = true;
            const tiledMap = new Components.TiledMap("map1", { debug: true });
            tiledMap.on("object", this.build.bind(this));
            tiledMap.init();
            map.addComponent(tiledMap);
            this.add(map);
        }

        this.add(EntityBuilder.create("actor:player"));
        this.add(...EntityBuilder.createMany("actor:creature", 5));
        this.add(EntityBuilder.create("sound:3D", "ambient-sound"));
    }

    /**
     * @param {!Actor} actor
     */
    build(actor) {
        if (actor.name.startsWith("door")) {
            actor.createScriptedBehavior("DoorBehavior");
        }
    }

    awake() {
        super.awake();

        console.log("Default Scene Awake");
    }
}

Scene.define("default", DefaultScene);
