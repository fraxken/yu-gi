// import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components } from "../ECS";

export default class RoomScene extends Scene {
    /**
     * @param {!string} roomName
     * @param {object} options
     * @param {number} [options.id]
     * @param {number} [options.x]
     * @param {number} [options.y]
     * @param {!Scene} rootScene
     */
    constructor(roomName, options = {}, rootScene) {
        super({ useLRUCache: true, debug: false });

        const { id, x, y, type, doors } = options;
        this.rootScene = rootScene;
        this.roomName = roomName;
        this.roomId = id;
        this.position.set(x, y);
        this.type = type;
        this.doors = doors;

        // All doors!
        this.doorLeft = null;
        this.doorRight = null;
        this.doorTop = null;
        this.doorBottom = null;

        {
            const map = new Actor(roomName);
            const tiledMap = new Components.TiledMap("room", {
                debug: false,
                showObjects: true,
                useSharedCollision: true,
                collisionOffset: { x, y }
            });
            tiledMap.on("object", this.build.bind(this));
            tiledMap.init();
            map.addComponent(tiledMap);

            this.add(map);
        }

        console.log(`Init room '${roomName}': ${type}`);
        console.log(doors);
    }

    createDoor(doorActor) {
        switch (doorActor.name) {
            case "door_left": {
                this.doorLeft = doorActor;
                break;
            }
            case "door_right": {
                this.doorRight = doorActor;
                break;
            }
            case "door_top": {
                this.doorTop = doorActor;
                break;
            }
            case "door_bottom": {
                this.doorBottom = doorActor;
                break;
            }
        }
    }

    connectDoors() {
        if (this.doors.left !== null) {
            const { scene } = this.rootScene.rooms.get(this.doors.left);
            const doorRight = scene.findChild("door_right", true);

            this.doorLeft.connectedTo = doorRight;
            this.doorLeft.createScriptedBehavior("DoorTestBehavior");
        }

        if (this.doors.right !== null) {
            const { scene } = this.rootScene.rooms.get(this.doors.right);
            const doorLeft = scene.findChild("door_left", true);

            this.doorRight.connectedTo = doorLeft;
            this.doorRight.createScriptedBehavior("DoorTestBehavior");
        }

        if (this.doors.top !== null) {
            const { scene } = this.rootScene.rooms.get(this.doors.top);
            const doorBottom = scene.findChild("door_bottom", true);

            this.doorTop.connectedTo = doorBottom;
            this.doorTop.createScriptedBehavior("DoorTestBehavior");
        }

        if (this.doors.bottom !== null) {
            const { scene } = this.rootScene.rooms.get(this.doors.bottom);
            const doorTop = scene.findChild("door_top", true);

            this.doorBottom.connectedTo = doorTop;
            this.doorBottom.createScriptedBehavior("DoorTestBehavior");
        }
    }

    /**
     * @param {!Actor} actor
     */
    build(actor) {
        if (actor.name.startsWith("door")) {
            this.createDoor(actor);
        }
    }
}

Scene.define("room", RoomScene);
