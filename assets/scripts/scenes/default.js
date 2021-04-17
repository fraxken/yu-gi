import { EntityBuilder, Timer } from "../helpers";
import { Scene, Actor, Components } from "../ECS";

const kHandicapForShooting = 120;

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true });

        const map = new Actor("map");
        map.visible = true;
        map.addComponent(new Components.TiledMap("map1"));
        this.add(map);

        this.add(EntityBuilder.create("actor:player"));
        this.add(...EntityBuilder.createMany("actor:creature", 5));

        this.player;
        this.creatures = [];
        for (let actor of this.actors) {
            if (actor[0].startsWith("creature")) {
                this.creatures.push(actor);
            }

            if (actor[0] === "player") {
                this.player = actor;
            }
        }
        this.delayToShoot = new Timer(kHandicapForShooting, { autoStart: false, keepIterating: false });
    }

    awake() {
        super.awake();

        console.log("Default Scene Awake");
    }

    update() {
        super.update();

        for (const creature of this.creatures) {
            const isInside = Math.pow(creature[1].position.x - this.player[1].x, 2) + Math.pow(creature[1].position.y - this.player[1].y, 2) <= creature[1].behaviors[0].radius * creature[1].behaviors[0].radius;
            if (creature[1].behaviors[0].canShoot() && isInside) {
                this.add(EntityBuilder.create("actor:projectile", { startPos: { x: creature[1].position.x, y: creature[1].position.y }, targetPos: { x: this.player[1].x, y: this.player[1].y }}));
            }
        }
    }
}

Scene.define("default", DefaultScene);
