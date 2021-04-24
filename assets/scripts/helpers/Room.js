import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components } from "../ECS";

export default class Room {
    /**
     * @param {!string} roomName
     * @param {object} options
     * @param {number} [options.id]
     * @param {number} [options.x]
     * @param {number} [options.y]
     * @param {!Scene} parent
     */
     constructor(roomName, options = {}, parent) {
        const { id, x, y, type, doors } = options;

        this.offsetX = x;
        this.offsetY = y;
        this.parent = parent;
        this.roomName = roomName;
        this.id = id;
        this.type = type;
        this.doors = doors;

        // All doors!
        this.doorLeft = null;
        this.doorRight = null;
        this.doorTop = null;
        this.doorBottom = null;
        {
            this.map = new Actor(roomName);
            this.map.position.set(x, y);
            this.tiledMap = new Components.TiledMap(this.type === "end" ? "boss_room" : "room", {
                debug: false,
                showObjects: true,
                useSharedCollision: true,
                autoAddObjects: false,
                collisionOffset: { x, y }
            });
            this.tiledMap.on("object", this.build.bind(this));
            this.map.addComponent(this.tiledMap);
        }

        console.log(`Init room '${roomName}': ${this.type}`);
        console.log(doors);
    }

    init() {
        const areaNameText = new PIXI.Text(`${this.roomName} - ${this.type}`, {
            fill: "#12d94d",
            fontFamily: "Verdana",
            fontSize: 20,
            fontVariant: "small-caps",
            fontWeight: "bold",
            letterSpacing: 1,
            lineJoin: "round",
            strokeThickness: 2,
            align: "center"
        });
        areaNameText.anchor.set(0.5);
        areaNameText.alpha = 0.6;

        areaNameText.position.set(this.parent.roomWidth * 16 / 2, this.parent.roomHeight * 16 / 2);

        this.map.addChild(areaNameText);
        this.parent.add(this.map);
        this.tiledMap.init();
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
            const room = this.parent.rooms.get(this.doors.left);

            this.doorLeft.connectedTo = room.doorRight;
            this.doorLeft.createScriptedBehavior("DungeonDoorBehavior");
            this.parent.add(this.doorLeft);
        }

        if (this.doors.right !== null) {
            const room = this.parent.rooms.get(this.doors.right);

            this.doorRight.connectedTo = room.doorLeft;
            this.doorRight.createScriptedBehavior("DungeonDoorBehavior");
            this.parent.add(this.doorRight);
        }

        if (this.doors.top !== null) {
            const room = this.parent.rooms.get(this.doors.top);

            this.doorTop.connectedTo = room.doorBottom;
            this.doorTop.createScriptedBehavior("DungeonDoorBehavior");
            this.parent.add(this.doorTop);
        }

        if (this.doors.bottom !== null) {
            const room = this.parent.rooms.get(this.doors.bottom);

            this.doorBottom.connectedTo = room.doorTop;
            this.doorBottom.createScriptedBehavior("DungeonDoorBehavior");
            this.parent.add(this.doorBottom);
        }
    }

    /**
     * @param {!Actor} actor
     */
    createEnemySpawner(actor) {
        console.log("Enemy spawner triggered!");
    }

    /**
     * @param {!Actor} actor
     */
    build(actor) {
        if (actor.name.startsWith("door")) {
            this.createDoor(actor);
            actor.name = EntityBuilder.increment("door");
        }
        else if (actor.name.startsWith("enemy")) {
            this.createEnemySpawner(actor);
            actor.name = EntityBuilder.increment("enemy");
            this.parent.add(actor);
        }

        actor.position.set(actor.x + this.offsetX, actor.y + this.offsetY);
    }
}
