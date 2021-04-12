import * as EntityBuilder from "../scripts/helpers/entitybuilder";
import Scene from "../scripts/ECS/scene.class";

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
