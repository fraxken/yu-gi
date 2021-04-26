// Import Internal Dependencies
import { EntityBuilder, Key, progressionParser, nextProgression, AnimatedText, Animations } from "../helpers";
import { Scene, Actor, getCurrentState, Timer } from "../ECS";
import Room from "../helpers/Room";

import RoomSpawner from "../helpers/RoomSpawner.class";
import DungeonConfiguration from "../dungeon-configuration";

// CONSTANTS
const kSecretRoomChanceFactor = 0.1;
const kRoomConfig = {
    roomWidth: 40,
    roomHeight: 26
};
const kSpawnerDefaultConfig = {
    ...Object.assign({}, kRoomConfig),
    tileSize: 16,
    marginWidth: 4,
    marginHeight: 4
};

export default class DungeonScene extends Scene {
    /**
     * @param {number} [roomsId=1]
     * @param {number} [niveauId=1]
     */
    constructor(roomsId = 1, niveauId = 1) {
        super({ useLRUCache: true, debug: false });
        Object.assign(this, { roomsId, niveauId }, kRoomConfig);
        this.config = DungeonConfiguration[roomsId][niveauId];

        /** @type {Actor[]} */
        this.connectedToSecret = [];

        /** @type {Map<number, Room>} */
        this.rooms = new Map();
        this.resetTextTimer = new Timer(120, {
            autoStart: false, keepIterating: false
        });

        const spawnerOptions = Object.assign({
            includeSecretRoom: Math.random() < kSecretRoomChanceFactor
        }, kSpawnerDefaultConfig);
        // TODO: remove this line
        spawnerOptions.includeSecretRoom = true;

        // Launch Spawner class to draw a dungeon layout
        const spawner = new RoomSpawner(10, {
            ...this.config.spawner, ...spawnerOptions
        });
        spawner.draw();
        const levelRooms = [...spawner.getWorldRooms()];

        this.playerCurrentRoomId = spawner.startPosition; // 45
        this.hasSecretRoom = spawnerOptions.includeSecretRoom;
        this.hasRecuperateurRoom = false;

        for (let i = 0; i < levelRooms.length; i++) {
            const room = levelRooms[i];

            const roomObject = new Room(i === 0 ? "start_room" : `room_${i}`, room, this);
            this.rooms.set(room.id, roomObject);
            roomObject.init();
        }

        this.createLockedText();
    }

    /**
     * @param {"lock" | "unlock"} [state="lock"]
     */
    setSecretRoomDoors(state = "lock") {
        for (const actor of this.connectedToSecret) {
            actor.behaviors[0].sendMessage(state);
        }
    }

    triggerLockedText() {
        this.lockedText.start();
        this.lockedText.on("stop", () => this.resetTextTimer.start());
    }

    createLockedText() {
        const style = {
            fill: "#E3F2FD",
            fontFamily: "Verdana",
            fontSize: 8,
            fontVariant: "small-caps",
            fontWeight: "bold",
            letterSpacing: 1,
            lineJoin: "round",
            strokeThickness: 2,
            align: "right"
        };

        this.lockedText = new AnimatedText(`Oh no! Survive.`, style, {
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

    /**
     * @param {boolean} [failure=true]
     */
    exitDungeon(failure = true) {
        const state = getCurrentState();
        state.setState("spawnActorName", "test");

        if (!failure) {
            const progression = state.getState("dungeon.progression");
            const next = nextProgression(progressionParser(progression));
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
        /** @type {Room} */
        let secretRoom = null;
        for (const room of this.rooms.values()) {
            room.connectDoors();
            if (room.type === "secret") {
                secretRoom = room;
            }
        }

        // Lock the doors connected to the secret room!
        if (secretRoom !== null) {
            for (const { door } of secretRoom.getActiveDoors()) {
                this.connectedToSecret.push(door.connectedTo);
            }
            this.setSecretRoomDoors("lock");
        }

        super.awake();

        /** @type {Actor} */
        this.playerActor = EntityBuilder.create("actor:player");
        this.playerActor.isInDungeon = true;
        this.playerActor.position.set(this.roomWidth * 16 / 2, this.roomHeight * 16 / 2);
        this.add(this.playerActor);
    }

    update() {
        super.update();

        // Update and handle timer for text that show we enter a survival room.
        if (this.resetTextTimer.walk()) {
            this.lockedText.reset();
        }
        if (this.lockedText.started || this.resetTextTimer.isStarted) {
            const centerPosition = this.playerActor.centerPosition;
            this.lockedText.position.set(centerPosition.x - 30, centerPosition.y - 80);
            this.lockedText.update();
        }

        // Open and close minimap
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
