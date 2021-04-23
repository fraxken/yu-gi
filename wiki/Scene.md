# Scene

Une scène est l'élément qui va rassembler tous les acteurs d'un jeu (ou d'un niveau de jeu). L'intêret technique d'une scène est de pouvoir segmenter de manière concrète un ensemble d'acteurs.

Un jeu peut être constitué de plusieurs scènes (par exemple les pièces d'un donjon peuvent être des scènes indépendantes). Néanmoins le jeu possède toujours une scène racine.

Il existe des méthodes sur l'Engine pour instancier et changer de scène principale.

```js
// Chargement d'une nouvelle scène principale.
game.loadScene("sceneName");

// Ajout d'une scène enfant à la scène principale.
game.appendScene("sceneName");
```

## Déclaration d'une scène.

```js
// Import Third-party Dependencies
import * as PIXI from "pixi.js";

// Import Internal Dependencies
import { EntityBuilder } from "../helpers";
import { Scene, Actor } from "../ECS";

import RoomSpawner from "../helpers/RoomSpawner.class";

// Notre nouvelle scène étend de l'objet Scène de l'ECS!
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

        this.levelRooms = [...spawner.getWorldRooms()];
        this.startRoom = this.levelRooms[0];

        // Ajout des "rooms" sous forme de scènes indépendantes.
        for (let i = 0; i < this.levelRooms.length; i++) {
            game.appendScene("room", {
                params: [i === 0 ? "start_room" : `room_${i}`, this.levelRooms[i]],
                loaded: this.sceneLoaded.bind(this)
            });
        }
    }

    // Callback qui sera déclenché quand la scène enfant sera générée.
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

    // Avoir le centre d'une room.
    centerOfRoom(room) {
        return { x: room.x + (this.roomWidth * 16 / 2), y: room.y + (this.roomHeight * 16 / 2) }
    }

    awake() {
        // Important: toujours penser à appeler la méthode parent pour awake, start, update, cleanup ...
        super.awake();

        /** @type {Actor} */
        const playerActor = EntityBuilder.create("actor:player");

        // On centre le joueur dans la pièce du début.
        const startCenter = this.centerOfRoom(this.startRoom);
        playerActor.position.set(startCenter.x, startCenter.y);

        // Ajout de l'acteur dans la scène
        this.add(playerActor);
    }
}

// Comme pour les Scripts, permet de définir le nom de la scène sous forme d'une string.
Scene.define("dungeon", DungeonScene);
```

## Methods

### add(...entities)

Il est important d'utiliser la méthode .add() au lieu de .addChild() sur une scène car celle-ci est spécialement construite pour gérer des objets de type "Actor" ou "Scène".
