// Import Dependencies
import Engine from "./ECS/engine.class.js";
import * as Behaviors from "./behaviours/all";

import * as defaultScene from "../scenes/default";

Behaviors.init();
new Engine({ defaultScene })
    .registerAsset("adventurer", "sprites/adventurer.json")
    .init();
