// Import Internal Dependencies
import { EntityBuilder, Key, progressionParser, nextProgression } from "../helpers";
import { Scene, Actor, getCurrentState } from "../ECS";
import Room from "../helpers/Room";

import RoomSpawner from "../helpers/RoomSpawner.class";

// CONSTANTS
const kSecretRoomChanceFactor = 0.1;

export default class DungeonScene extends Scene {
    static Settings = {
        1: {
            1: { minRooms: 4, maxRooms: 5 },
            2: { minRooms: 5, maxRooms: 7, specialRooms: 1 },
            3: { minRooms: 6, maxRooms: 8, specialRooms: 1, includeSecretRoom: true, maxBoss: 2 }
        },
        2: {
            1: { minRooms: 7, maxRooms: 10, specialRooms: 2 },
            2: { minRooms: 8, maxRooms: 12, specialRooms: 2 },
            3: { minRooms: 9, maxRooms: 14, specialRooms: 2, includeSecretRoom: true, maxBoss: 2 }
        },
        3: {
            1: { minRooms: 10, maxRooms: 15, specialRooms: 3, includeSecretRoom: true },
            2: { minRooms: 12, maxRooms: 17, specialRooms: 4, includeSecretRoom: true },
            3: { minRooms: 15, maxRooms: 20, specialRooms: 5, includeSecretRoom: true, maxBoss: 2 }
        }
    }

    constructor(roomsId = 1, niveauId = 1) {
        super({ useLRUCache: true, debug: false });
        this.roomWidth = 40;
        this.roomHeight = 26;
        this.hasRecuperateurRoom = false;
        this.playerCurrentRoomId = 45;

        const defaultSettings = {
            roomWidth: this.roomWidth,
            roomHeight: this.roomHeight,
            tileSize: 16,
            marginWidth: 4,
            marginHeight: 4
        };
        // defaultSettings.includeSecretRoom = Math.random() < kSecretRoomChanceFactor;
        defaultSettings.includeSecretRoom = true;
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

        for (let room of this.rooms) {
            // IN ROOM
            const maxPossibleEnemiesInRoom = 3;
            const minPossibleEnemiesInRoom = 1;
            const nbEnemyInThisRoom = Math.floor(Math.random() * maxPossibleEnemiesInRoom) + minPossibleEnemiesInRoom;
            const generatedEnemyForThisRoom = []

            for (let index = 0; index <= nbEnemyInThisRoom; ++index) {
                const randomUnit = Math.random() <= 0.7 ? "melee" : "caster";

                generatedEnemyForThisRoom.push(randomUnit);
            }

            let rest = undefined;
            for (let object of room[1].tiledMap.objects) {

                if (object[0].startsWith("enemy_")) {
                    // IN ZONE
                    let nbEnemyForThisZone = 0;
                    if (rest === undefined) {
                        nbEnemyForThisZone = Math.floor(Math.random() * generatedEnemyForThisRoom.length) + 1;
                        rest = nbEnemyInThisRoom - nbEnemyForThisZone;
                    } else if (rest !== 0 && rest !== undefined) {
                        nbEnemyForThisZone = rest;
                        rest = 0;

                    }

                    const enemyForThisZone = generatedEnemyForThisRoom.splice(0, nbEnemyForThisZone);
                    for (const enemy of enemyForThisZone) {
                        console.log(`added ${enemy}`)
                        this.add(...EntityBuilder.createMany(`actor:${enemy}`, 1, {
                            radius: 20,
                            x: object[1].x,
                            y: object[1].y
                        }));
                    }
                }
            }
        }
    }

    exitDungeon(failure = true) {
        const state = getCurrentState();
        state.setState("spawnActorName", "test");

        if (!failure) {
            const progression = state.getState("dungeon.progression");
            const next = nextProgression(progressionParser(progression));

            console.log("NEXT PROG: ", next);
            state.setState("dungeon.progression", `${next[0]}.${next[1]}`);
        }

        game.loadScene("default");
    }

    getMinimapData() {
        const currentRoom = this.rooms.get(this.playerCurrentRoomId);
        const currentDoors = [...currentRoom.getActiveDoors()];

        const connectedRooms = new Map();
        for (const { side, door } of currentDoors) {
            const room = door.connectedTo.roomInstance;

            connectedRooms.set(side, {
                id: room.id,
                type: room.type,
                side: new Set([...room.getActiveDoors()].map((row) => row.side))
            });
        }

        return {
            currentRoom: {
                id: this.playerCurrentRoomId,
                type: currentRoom.type,
                side: new Set(currentDoors.map((row) => row.side))
            },
            connectedRooms
        }
    }

    awake() {
        for (const room of this.rooms.values()) {
            room.connectDoors();
        }

        super.awake();

        /** @type {Actor} */
        const playerActor = EntityBuilder.create("actor:player");
        playerActor.isInDungeon = true;

        const startCenter = {
            x: this.startRoom.x + (this.roomWidth * 16 / 2),
            y: this.startRoom.y + (this.roomHeight * 16 / 2)
        };

        playerActor.position.set(startCenter.x, startCenter.y);
        this.add(playerActor);
    }

    update() {
        super.update();

        if(game.input.wasKeyJustPressed(Key.M)) {
            hudevents.emit("minimap", true);
        }
        else if (game.input.wasKeyJustReleased(Key.M)) {
            hudevents.emit("minimap", false);
        }

        for (const room of this.rooms.values()) {
            room.update();
        }
    }
}

Scene.define("dungeon", DungeonScene);
