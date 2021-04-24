// Import Third-party Dependencies
import * as PIXI from "pixi.js";

// Import Internal Dependencies
import { EntityBuilder } from "../helpers";
import { Scene, Actor } from "../ECS";
import Room from "../helpers/Room";

import RoomSpawner from "../helpers/RoomSpawner.class";

export default class DungeonScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: false });
        this.roomWidth = 40;
        this.roomHeight = 26;

        const spawner = new RoomSpawner(10, {
            includeSecretRoom: false,
            minRooms: 3,
            maxRooms: 3,
            marginWidth: 4,
            marginHeight: 4,
            roomWidth: this.roomWidth,
            roomHeight: this.roomHeight,
            tileSize: 16
        });
        spawner.draw();

        const levelRooms = [...spawner.getWorldRooms()];
        this.rooms = new Map();
        this.startRoom = levelRooms[0];

        for (let i = 0; i < levelRooms.length; i++) {
            const room = levelRooms[i];

            const roomObject = new Room(i === 0 ? "start_room" : `room_${i}`, room, this);
            this.rooms.set(room.id, roomObject);
            roomObject.init();
        }
    }

    awake() {
        console.log(this.rooms);
        for (const room of this.rooms.values()) {
            console.log(`Connect doors for scene: ${room.id}`);
            room.connectDoors();
        }

        super.awake();

        /** @type {Actor} */
        const playerActor = EntityBuilder.create("actor:player");
        const startCenter = {
            x: this.startRoom.x + (this.roomWidth * 16 / 2),
            y: this.startRoom.y + (this.roomHeight * 16 / 2)
        };

        playerActor.position.set(startCenter.x, startCenter.y);
        this.add(playerActor);
    }
}

Scene.define("dungeon", DungeonScene);
