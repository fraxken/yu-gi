// Import Internal Dependencies
import { EntityBuilder, Key, progressionParser, nextProgression, AnimatedText, Animations } from "../helpers";
import { Scene, Actor, getCurrentState, Timer } from "../ECS";
import Room from "../helpers/Room";

import RoomSpawner from "../helpers/RoomSpawner.class";

// CONSTANTS
const kSecretRoomChanceFactor = 0.1;

export default class DungeonScene extends Scene {
    static Settings = {
        1: {
            1: { minRooms: 2, maxRooms: 3, specialRooms: 1 },
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

    static textStyle(color = "#E3F2FD") {
        return {
            fill: color,
            fontFamily: "Verdana",
            fontSize: 8,
            fontVariant: "small-caps",
            fontWeight: "bold",
            letterSpacing: 1,
            lineJoin: "round",
            strokeThickness: 2,
            align: "right"
        }
    }

    constructor(roomsId = 1, niveauId = 1) {
        super({ useLRUCache: true, debug: false });
        this.roomWidth = 40;
        this.roomHeight = 26;
        this.roomsId = roomsId;
        this.niveauId = niveauId;
        this.hasRecuperateurRoom = false;
        this.playerCurrentRoomId = 45;
        this.resetTextTimer = new Timer(120, { autoStart: false, keepIterating: false });

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

        this.createLockedText();
    }

    triggerLockedText() {
        this.lockedText.start();
        this.lockedText.on("stop", () => this.resetTextTimer.start());
    }

    createLockedText() {
        this.lockedText = new AnimatedText(`Oh no! Survive.`, DungeonScene.textStyle(), {
            autoStart: false,
            animations: [
                new Animations.WritingTextAnimation({
                    charTick: 7,
                    pauseTimeBetweenLine: 0
                }),
                new Animations.FadeTextAnimation({
                    frame: 60,
                    easing: "easeInQuad",
                    defaultState: "out"
                }),
                new Animations.MovingTextAnimation({
                    decalY: -70,
                    frame: 120,
                    easing: "easeOutQuad"
                })
            ]
        });
        this.lockedText.gameObject.anchor.set(0.5);

        this.addChild(this.lockedText);
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
        this.playerActor = EntityBuilder.create("actor:player");
        this.playerActor.isInDungeon = true;

        const startCenter = {
            x: this.startRoom.x + (this.roomWidth * 16 / 2),
            y: this.startRoom.y + (this.roomHeight * 16 / 2)
        };

        this.playerActor.position.set(startCenter.x, startCenter.y);
        this.add(this.playerActor);
    }

    update() {
        super.update();

        if (this.resetTextTimer.walk()) {
            this.lockedText.reset();
        }

        if (this.lockedText.started || this.resetTextTimer.isStarted) {
            const centerPosition = this.playerActor.centerPosition;
            // const { height } = game.screenSize;
            this.lockedText.position.set(centerPosition.x - 30, centerPosition.y - 80);
            this.lockedText.update();
        }

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
