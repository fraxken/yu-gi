// import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components } from "../ECS";

export default class RoomScene extends Scene {
    constructor(roomName, options = {}) {
        super({ useLRUCache: true, debug: false });

        const { x, y, type, doors } = options;
        this.position.set(x, y);

        {
            const map = new Actor(roomName);
            map.visible = true;

            const tiledMap = new Components.TiledMap("room", {
                debug: false,
                useSharedCollision: true,
                collisionOffset: { x, y }
            });
            // tiledMap.on("object", this.build.bind(this));
            tiledMap.init();
            map.addComponent(tiledMap);
            this.add(map);
        }

        console.log(`Init room '${roomName}': ${type} - ${doors}`);
    }
}

Scene.define("room", RoomScene);
