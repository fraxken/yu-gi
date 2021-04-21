// Import Third-party Dependencies
import * as PIXI from "pixi.js";

// Import Internal Dependencies
import { EntityBuilder } from "../helpers";
import { Scene, Actor } from "../ECS";

import RoomSpawner from "../helpers/RoomSpawner.class";

export default class DungeonScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: true });
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

        this.levelRooms = [...spawner.getWorldRooms()];
        this.startRoom = this.levelRooms[0];

        for (let i = 0; i < this.levelRooms.length; i++) {
            game.appendScene("room", {
                params: [i === 0 ? "start_room" : `room_${i}`, this.levelRooms[i]],
                loaded: this.sceneLoaded.bind(this)
            });
        }
    }

    sceneLoaded(scene) {
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

        /** @type {Actor} */
        const playerActor = EntityBuilder.create("actor:player");
        const startCenter = this.centerOfRoom(this.startRoom);

        playerActor.position.set(startCenter.x, startCenter.y);
        this.add(playerActor);
    }
}

Scene.define("dungeon", DungeonScene);
