import { EntityBuilder } from "../helpers";
import { Scene } from "../ECS";

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true });

        this.add(EntityBuilder.create("actor:player"));
        for (let i = 0; i < 5; i++) {
            this.add(EntityBuilder.create(`actor:creature${i}`));
        }
    }

    awake() {
        super.awake();

        console.log("Default Scene Awake");
    }
}

Scene.define("default", DefaultScene);
