import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components } from "../ECS";

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: true });

        {
            const map = new Actor("map");
            map.visible = true;
            const tiledMap = new Components.TiledMap("map1", { debug: false });
            tiledMap.on("object", this.build.bind(this));
            tiledMap.init();
            map.addComponent(tiledMap);
            this.add(map);
        }

        this.add(EntityBuilder.create("actor:player"));
        // this.add(...EntityBuilder.createMany("actor:creature", 5));
        this.add(EntityBuilder.create("sound:3D", "ambient-sound"));
    }

    /**
     * @param {!Actor} actor
     */
    build(actor) {
        if (actor.name.startsWith("door")) {
            actor.createScriptedBehavior("DoorBehavior");
        }
        else if (actor.name === "test") {
            actor.createScriptedBehavior("DungeonDoorBehavior");
        }
    }
}

Scene.define("default", DefaultScene);
