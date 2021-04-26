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
};
const kDoorNameConverter = {
    door_left: "doorLeft",
    door_right: "doorRight",
    door_top: "doorTop",
    door_bottom: "doorBottom"
};

const kRoomEntities = {
    boss: { behavior: "BossBehavior" },
    chest: { behavior: "ChestBehavior" },
    damage: { behavior: "DamageAreaBehavior" }
}

const kRoomsConfiguration = {
    end: ["boss_room"],
    boss: ["boss_room"],
    start: ["no_enemy_room"],
    secret: ["no_enemy_room"],
    special: ["no_enemy_room"],
    recuperateur: ["no_enemy_room"],
    room: ["room"],
    survival: ["room"],
    trap: ["room"],
    parcours: ["room"]
};

const kDebug = true;

export default class Room {
    static getRandomRoom(type) {
        const arr = kRoomsConfiguration[type];

        return arr[Math.floor(Math.random() * arr.length)];
    }

    static getNormalRoomSubType() {
        const rate = Math.random();

        if (rate < 0.5) {
            return "room";
        }
        else if (rate >= 0.5 && rate < 0.65) {
            return "survival";
        }
        else if (rate >= 0.65 && rate < 0.80) {
            return "trap";
        }
        else {
            return "parcours";
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
        this.creatureOptions = {
            defenseMultiplier: this.parent.config.ia.defenseMultiplier,
            attackMultiplier: this.parent.config.ia.attackMultiplier,
            hpMultiplier: this.parent.config.ia.hpMultiplier,
            missRatio: this.parent.config.ia.missRatio,
            goldMultiplier: this.parent.config.goldMultiplier
        }
        this.roomName = roomName;
        this.id = id;
        this.roomIA = [];
        this.fade = null;
        this.doorLockTimer = new Timer(60 * 10, { autoStart: false, keepIterating: false });

        // Generate fade (except for the start room which id is 45).
        if (this.id !== 45) {
            this.generateWarFade();
        }

        /** @type {"end" | "boss" | "room" | "special" | "secret" | "recuperateur" | "trap" | "survival" | "parcours"} */
        this.type = type === "room" ? Room.getNormalRoomSubType() : type;
        this.isRecuperateurRoom = this.type === "special" && !parent.hasRecuperateurRoom;
        if (this.isRecuperateurRoom) {
            this.type = "recuperateur";
            parent.hasRecuperateurRoom = true;
        }

        // All doors!
        this.doors = doors;
        this.doorLeft = null;
        this.doorRight = null;
        this.doorTop = null;
        this.doorBottom = null;

        // Generate Tiled Map
        {
            this.map = new Actor(roomName);
            this.map.position.set(x, y);

            this.tiledMap = new Components.TiledMap(Room.getRandomRoom(this.type), {
                debug: false,
                showObjects: kDebug,
                useSharedCollision: true,
                autoAddObjects: false,
                collisionOffset: { x, y }
            });
            this.tiledMap.on("object", this.build.bind(this));
            this.map.addComponent(this.tiledMap);
        }

        console.log(`Init room '${roomName}': ${this.type}`);
    }

    generateWarFade() {
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
        if (kDebug) {
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
        }

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

        if (this.type === "trap") {
            // TODO: send events to IA of the rooms ?
            window.mediaplayer.play("battle");
            this.setDoorLock("locked");
            this.parent.triggerLockedText();
        }
        else if (this.type === "boss") {
            window.mediaplayer.play("battle");
        }
        else {
            window.mediaplayer.play("donjon");
        }
    }

    playerExitRoom() {
        if (this.fade !== null) {
            this.fade.out();
        }
        console.log("Player exit the room id: ", this.roomName, this.id);
    }

    /**
     * @description where we build all actors and objects of the room
     * @param {!Actor} actor
     */
    build(actor) {
        if (actor.name.startsWith("door")) {
            actor.roomInstance = this;
            this[kDoorNameConverter[actor.name]] = actor;
            actor.name = EntityBuilder.increment("door");
        }
        else if (actor.name.startsWith("enemy")) {
            actor.createScriptedBehavior(Math.random() <= 0.6 ? "MeleeBehavior" : "CasterBehavior", this.creatureOptions);
            actor.name = EntityBuilder.increment("enemy");
            this.parent.add(actor);
        }
        else if (this.parent.hasSecretRoom && this.isRecuperateurRoom && actor.name.startsWith("levier")) {
            actor.createScriptedBehavior("SecretLevierBehavior");
            actor.name = EntityBuilder.increment("levier");
            this.parent.add(actor);
        }

        for (const [actorName, config] of Object.entries(kRoomEntities)) {
            if (actor.name.startsWith(actorName)) {
                actor.createScriptedBehavior(config.behavior);
                actor.name = EntityBuilder.increment(actorName);
                this.parent.add(actor);

                break;
            }
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
