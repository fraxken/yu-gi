// Import Third-party Dependencies
import PIXI from "pixi.js";

// Import Internal Dependencies
import { EntityBuilder } from "../helpers";
import { Scene, Actor, Components, Timer, Fade } from "../ECS";
import DungeonScene from "../scenes/DungeonScene";

// CONSTANTS
const kReverseDoor = {
    left: "doorRight",
    right: "doorLeft",
    top: "doorBottom",
    bottom: "doorTop"
}

export default class Room {
    static getNormalRoomSubType() {
        const rate = Math.random();

        if (rate < 0.5) {
            return "room";
        }
        else if (rate >= 0.5 && rate < 0.65) {
            return "survival_room";
        }
        else if (rate >= 0.65 && rate < 0.80) {
            return "trap_room";
        }
        else {
            return "parcours_room";
        }
    }

    /**
     * @param {!string} roomName
     * @param {object} options
     * @param {number} [options.id]
     * @param {number} [options.x]
     * @param {number} [options.y]
     * @param {!DungeonScene} parent
     */
     constructor(roomName, options = {}, parent) {
        const { id, x, y, type, doors } = options;

        this.offsetX = x;
        this.offsetY = y;
        this.parent = parent;
        this.roomName = roomName;
        this.id = id;
        this.roomIA = [];
        this.doorLockTimer = new Timer(60 * 10, { autoStart: false, keepIterating: false });
        this.fade = null;
        if (this.id !== 45) {
            this.addFade();
        }

        /** @type {"end" | "boss" | "room" | "special" | "secret" | "recuperateur"} */
        this.type = type;
        this.isRecuperateurRoom = this.type === "special" && !parent.hasRecuperateurRoom;
        if (this.isRecuperateurRoom) {
            this.type = "recuperateur";
            parent.hasRecuperateurRoom = true;
        }
        this.doors = doors;

        // All doors!
        this.doorLeft = null;
        this.doorRight = null;
        this.doorTop = null;
        this.doorBottom = null;

        {
            this.map = new Actor(roomName);
            this.map.position.set(x, y);

            // TODO: dynamically update this depending on the kind of the room
            this.tiledRoomName = this.getTiledMapName();
            console.log(this.tiledRoomName);

            let tempType = this.type === "end" || this.type === "boss" ? "boss_room" : "room";
            if (this.type === "start" || this.type === "secret" || this.type === "special" || this.type === "recuperateur") {
                tempType = "no_enemy_room";
            }

            this.tiledMap = new Components.TiledMap(tempType, {
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
    }

    addFade() {
        const fadeGraphic = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#000"), 1)
            .drawRect(0, 0, this.parent.roomWidth * 16, this.parent.roomHeight * 16)
            .endFill();
        fadeGraphic.position.set(this.offsetX, this.offsetY);
        fadeGraphic.zIndex = 25;

        this.fade = new Fade(fadeGraphic, {
            frame: 45, delayIn: 0, delayOut: 60, defaultState: "out"
        });
        this.parent.addChild(fadeGraphic);
    }

    getTiledMapName() {
        if (this.isRecuperateurRoom) {
            return "recuperateur_room";
        }

        switch (this.type) {
            case "room": return Room.getNormalRoomSubType();
            case "start": return "start";
            case "special": return "chest_room";
            case "boss": return "boss_room";
            case "end": return "boss_room";
            case "secret": return "secret_room";
        }
    }

    getDoorByDirection(direction) {
        switch (direction) {
            case "left": return this.doorLeft;
            case "right": return this.doorRight;
            case "top": return this.doorTop;
            case "bottom": return this.doorBottom;
        }
    }

    *getActiveDoors() {
        const leftScript = this.doorLeft.getScriptedBehavior("_DungeonDoorBehavior");
        if (leftScript) {
            yield { door: this.doorLeft, side: "left" };
        }

        const rightScript = this.doorRight.getScriptedBehavior("_DungeonDoorBehavior");
        if (rightScript) {
            yield { door: this.doorRight, side: "right" };
        }

        const topScript = this.doorTop.getScriptedBehavior("_DungeonDoorBehavior");
        if (topScript) {
            yield { door: this.doorTop, side: "top" };
        }

        const bottomScript = this.doorBottom.getScriptedBehavior("_DungeonDoorBehavior");
        if (bottomScript) {
            yield { door: this.doorBottom, side: "bottom" };
        }
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

        if (this.isRecuperateurRoom) {
            const recuperatorActor = new Actor("recuperatorActor")
                .createScriptedBehavior("RecuperateurBehavior");

            recuperatorActor.position.set(
                this.offsetX + (this.parent.roomWidth * 16 / 2),
                this.offsetY + (this.parent.roomHeight * 16 / 2)
            );
            this.parent.add(recuperatorActor);
        }
    }

    createDoor(doorActor) {
        doorActor.roomInstance = this;

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
        for (const [doorDirection, value] of Object.entries(this.doors)) {
            if (value === null) {
                continue;
            }

            const room = this.parent.rooms.get(this.doors[doorDirection]);
            const door = this.getDoorByDirection(doorDirection);

            door.connectedTo = room[kReverseDoor[doorDirection]];
            door.createScriptedBehavior("DungeonDoorBehavior");
            this.parent.add(door);

            door.on("player_enter", () => this.playerEnterRoom(doorDirection));
            door.on("player_leave", () => this.playerExitRoom(doorDirection));
        }
    }

    /**
     * @param {"locked" | "unlocked"} [status="locked"]
     */
    setDoorLock(status = "locked") {
        const eventName = status === "locked" ? "lock" : "unlock";
        console.log("setDoorLock", eventName);
        if (eventName === "lock") {
            this.doorLockTimer.start();
        }

        for (const { door } of this.getActiveDoors()) {
            // _DungeonDoorBehavior ???
            const script = door.getScriptedBehavior("_DungeonDoorBehavior");
            script.sendMessage(eventName);
        }
    }

    playerEnterRoom() {
        if (this.fade !== null) {
            this.fade.in();
        }

        console.log("Player enter the room id: ", this.roomName, this.id);
        this.parent.playerCurrentRoomId = this.id;

        if (this.tiledRoomName === "trap_room") {
            // TODO: send events to IA of the rooms ?
            this.setDoorLock("locked");
            this.parent.triggerLockedText();
        }
    }

    playerExitRoom() {
        if (this.fade !== null) {
            this.fade.out();
        }
        console.log("Player exit the room id: ", this.roomName, this.id);
    }

    /**
     * @param {!Actor} actor
     */
    createEnemySpawner(actor) {
        // console.log("Enemy spawner triggered!");

        const randomUnitBehavior = Math.random() <= 0.6 ? "MeleeBehavior" : "CasterBehavior";
        actor.createScriptedBehavior(randomUnitBehavior);
        // this.roomIA.push(actor);
    }

    /**
     * @description where we build all actors and objects of the room
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
        else if (actor.name.startsWith("boss")) {
            actor.createScriptedBehavior("BossBehavior");
            actor.name = EntityBuilder.increment("boss");
            this.parent.add(actor);
        }
        else if (actor.name.startsWith("chest")) {
            actor.createScriptedBehavior("ChestBehavior");
            actor.name = EntityBuilder.increment("chest");
            this.parent.add(actor);
        }
        else if (actor.name.startsWith("damage")) {
            actor.createScriptedBehavior("DamageAreaBehavior");
            actor.name = EntityBuilder.increment("damage");
            this.parent.add(actor);
        }
        else if (this.parent.hasSecretRoom && this.isRecuperateurRoom && actor.name.startsWith("levier")) {
            actor.createScriptedBehavior("SecretLevierBehavior");
            actor.name = EntityBuilder.increment("levier");
            this.parent.add(actor);
        }

        actor.position.set(actor.x + this.offsetX, actor.y + this.offsetY);
    }

    update() {
        if (this.doorLockTimer.isStarted && this.doorLockTimer.walk()) {
            this.setDoorLock("unlocked");
        }

        if (this.fade !== null) {
            this.fade.update();
        }
    }
}
