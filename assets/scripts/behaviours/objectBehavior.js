import { EntityBuilder } from "../helpers";
import { Inputs } from "../keys";
import { Actor, ScriptBehavior, Vector2, Components, getActor } from "../ECS";

export default class ObjectBehavior extends ScriptBehavior {

    constructor() {
        super();

        const { x, y } = Vector2.randomCoordInRadius(200)
        this.position = { x, y };
        this.radius = 80;
    }

    awake() {
        this.sprite = this.actor.addComponent(
            new Components.AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );

        this.actor.position.set(this.position.x, this.position.y);
    }

    start() {
        this.target = getActor("player");
    }

    update() {
        if (this.canBeTriggered()) {
            game.emit("interaction", { emitter: this.actor, target: this.target });
        }
    }

    canBeTriggered() {
        const isInside = Math.pow(this.actor.x - this.target.x, 2) + Math.pow(this.actor.y - this.target.y, 2) <= this.radius * this.radius;

        return isInside && Inputs.use();
    }
}

ScriptBehavior.define("ObjectBehavior", ObjectBehavior);

EntityBuilder.define("actor:object", (options = {}) => {
    return new Actor("object")
        .createScriptedBehavior("ObjectBehavior");
});
