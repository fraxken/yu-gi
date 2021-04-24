// Import Internal Dependencies
import { EntityBuilder } from "../helpers";
import { Scene, Actor } from "../ECS";
import Room from "../helpers/Room";

import RoomSpawner from "../helpers/RoomSpawner.class";

// CONSTANTS
const kSecretRoomChanceFactor = 0.1;

export default class DungeonScene extends Scene {
    static Settings = {
        1: {
            1: { minRooms: 4, maxRooms: 5 },
            2: { minRooms: 5, maxRooms: 7, specialRooms: 1 },
            3: { minRooms: 6, maxRooms: 8, specialRooms: 1, includeSecretRoom: true }
        },
        2: {
            1: { minRooms: 7, maxRooms: 10, specialRooms: 2 },
            2: { minRooms: 8, maxRooms: 12, specialRooms: 2 },
            3: { minRooms: 9, maxRooms: 14, specialRooms: 2, includeSecretRoom: true, maxBoss: 2 }
        },
        3: {
            1: { minRooms: 10, maxRooms: 15, specialRooms: 3, includeSecretRoom: true },
            2: { minRooms: 12, maxRooms: 17, specialRooms: 4, includeSecretRoom: true, maxBoss: 2 },
            3: { minRooms: 15, maxRooms: 20, specialRooms: 5, includeSecretRoom: true, maxBoss: 3 }
        }
    }

    constructor(roomsId = 1, niveauId = 1) {
        super({ useLRUCache: true, debug: false });
        this.roomWidth = 40;
        this.roomHeight = 26;

        const defaultSettings = {
            roomWidth: this.roomWidth,
            roomHeight: this.roomHeight,
            tileSize: 16,
            marginWidth: 4,
            marginHeight: 4
        };
        defaultSettings.includeSecretRoom = Math.random() < kSecretRoomChanceFactor;
        const spawner = new RoomSpawner(10, {
            ...DungeonScene.Settings[roomsId][niveauId],
            ...defaultSettings
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

    endDungeon() {

    }

    awake() {
        // console.log(this.rooms);
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
