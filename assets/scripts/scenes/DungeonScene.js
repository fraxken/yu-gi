// Import Third-party Dependencies
import * as PIXI from "pixi.js";

// Import Internal Dependencies
import { EntityBuilder } from "../helpers";
import { Scene, Actor } from "../ECS";

import RoomSpawner from "../helpers/RoomSpawner.class";
import RoomScene from "./RoomScene";

export default class DungeonScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: false });
        this.roomWidth = 40;
        this.roomHeight = 26;

        const spawner = new RoomSpawner(10, {
            includeSecretRoom: false,
            minRooms: 6,
            maxRooms: 10,
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
            this.rooms.set(room.id, {
                scene: null
            });

            game.appendScene("room", {
                params: [i === 0 ? "start_room" : `room_${i}`, room, this],
                loaded: this.sceneLoaded.bind(this)
            });
        }
    }

    /**
     * @param {!RoomScene} scene
     */
    sceneLoaded(scene) {
        this.rooms.get(scene.roomId).scene = scene;

        const areaNameText = new PIXI.Text(`${scene.roomName} - ${scene.type}`, {
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
        areaNameText.alpha = 0.35;

        areaNameText.position.set(this.roomWidth * 16 / 2, this.roomHeight * 16 / 2);
        scene.addChild(areaNameText);
    }

    centerOfRoom(room) {
        return {
            x: room.x + (this.roomWidth * 16 / 2),
            y: room.y + (this.roomHeight * 16 / 2)
        }
    }

    awake() {
        super.awake();
        for (const { scene } of this.rooms.values()) {
            scene.connectDoors();
        }

        /** @type {Actor} */
        const playerActor = EntityBuilder.create("actor:player");
        const startCenter = this.centerOfRoom(this.startRoom);

        playerActor.position.set(startCenter.x, startCenter.y);
        this.add(playerActor);
    }
}

Scene.define("dungeon", DungeonScene);
