import { EntityBuilder, zIndexManager } from "../helpers";
import { Scene, Actor, Components, getActor } from "../ECS";

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

        const playerActor = EntityBuilder.create("actor:player");
        this.add(playerActor);
        // this.add(...EntityBuilder.createMany("actor:creature", 5));
        // this.add(EntityBuilder.create("sound:3D", "ambient-sound"));

        this.graph = new Actor("graph");
        {
            const temp = new PIXI.Graphics()
                .beginFill(PIXI.utils.string2hex("#000"), 1)
                .drawCircle(0, 0, 30)
                .endFill();
            this.graph.addChild(temp);
        }
        this.graph.position.set(0, 0);
        this.addChild(this.graph);

        this.zManager = new zIndexManager(playerActor, [this.graph]);
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

    update() {
        super.update();

        this.zManager.update();
    }
}

Scene.define("default", DefaultScene);
