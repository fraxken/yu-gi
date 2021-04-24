import { Actor, ScriptBehavior } from "../ECS";
import { EntityBuilder } from "../helpers";

export default class InteractionBehavior extends ScriptBehavior {

    constructor(options) {
        super();

        this.emitter = options.emitter;
        this.target = options.target;
    }

    awake() {
        game.emit("interaction", { emitter: this.emitter, target: this.target});

        return this;
    }
}

ScriptBehavior.define("InteractionBehavior", InteractionBehavior);

EntityBuilder.define("actor:interaction", (options = {}) => {
    return new Actor(EntityBuilder.increment("interaction"))
        .createScriptedBehavior(new InteractionBehavior(options));
});
