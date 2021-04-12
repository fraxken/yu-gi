import { EntityBuilder } from "../helpers";
import { Scene } from "../ECS";

export default class DefaultScene extends Scene {
    constructor() {
        super({ useLRUCache: true });

        this.add(EntityBuilder.create("actor:player"));
    }

    awake() {
        super.awake();

        console.log("SCENE Awake");
    }
}

Scene.define("default", DefaultScene);
