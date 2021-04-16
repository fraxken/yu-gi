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
        this.add(...EntityBuilder.createMany("actor:creature", 1));

        this.delayToShoot = new Timer(kHandicapForShooting, { autoStart: false, keepIterating: false });
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
    }

    awake() {
        super.awake();

        console.log("Default Scene Awake");
    }

    update() {
        super.update();

        const isInside = Math.pow(this.creatures[0][1].behaviors[0].actor.position.x - this.player[1].x, 2) + Math.pow(this.creatures[0][1].behaviors[0].actor.position.y - this.player[1].y, 2) <= this.creatures[0][1].behaviors[0].radius * this.creatures[0][1].behaviors[0].radius;
        if (isInside) {
            if (!this.delayToShoot.isStarted) {
                this.delayToShoot.start();
            }

            if (this.delayToShoot.walk()) {
                this.delayToShoot.reset();
                this.add(EntityBuilder.create("actor:projectile", { startPos: { x: this.creatures[0][1].behaviors[0].actor.position.x, y: this.creatures[0][1].behaviors[0].actor.position.y }, targetPos: { x: this.player[1].x, y: this.player[1].y }}));
            }
        }
    }
}

Scene.define("default", DefaultScene);
