import { EntityBuilder, zIndexManager } from "../helpers";
import { Scene, Actor, Components, getActor } from "../ECS";

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: true });

        {
            const map = new Actor("map");
            const tiledMap = new Components.TiledMap("map1", {
                showObjects: true
            });
            tiledMap.on("object", this.build.bind(this));
            tiledMap.init();
            map.addComponent(tiledMap);
            this.add(map);
        }

        const playerActor = EntityBuilder.create("actor:player");
        this.add(playerActor);
        const objectActor = EntityBuilder.create("actor:object");
        this.add(objectActor);
        // this.add(...EntityBuilder.createMany("actor:caster", 5, {
        //     radius: 100,
        //     x: 0,
        //     y: 0
        // }));
        // this.add(...EntityBuilder.createMany("actor:melee", 4, {
        //     radius: 100,
        //     x: 0,
        //     y: 0
        // }));
        // this.add(EntityBuilder.create("sound:3D", "ambient-sound"));

        const stoneControlActor = EntityBuilder.create("actor:stoneControl");
        this.add(stoneControlActor);

        this.graph = new Actor("graph");
        {
            const temp = new PIXI.Graphics()
                .beginFill(PIXI.utils.string2hex("#000"), 0.2)
                .drawCircle(0, 0, 30)
                .endFill();
            this.graph.addChild(temp);
        }
        this.graph.position.set(0, 0);
        this.addChild(this.graph);

        this.zManager = new zIndexManager(playerActor, [this.graph]);
    }

    cleanup() {
        this.zManager.stop();
        this.zManager = null;
        super.cleanup();
    }

    /**
     * @param {!Actor} actor
     */
    build(actor) {
        if (actor.name.startsWith("door")) {
            actor.createScriptedBehavior("DoorBehavior");
        }
        else if (actor.name.startsWith("stele")) {
            actor.createScriptedBehavior("StoneBehavior");
        }
        else if (actor.name === "test") {
            actor.createScriptedBehavior("PortalBehavior");
        }
    }

    update() {
        super.update();

        if (this.zManager !== null) {
            this.zManager.update();
        }
    }
}

Scene.define("default", DefaultScene);
