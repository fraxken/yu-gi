import { EntityBuilder } from "../helpers";
import { Scene } from "../ECS";

export default class MarketScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: true });

        this.add(EntityBuilder.create("actor:player"));
    }
}

Scene.define("market", MarketScene);
