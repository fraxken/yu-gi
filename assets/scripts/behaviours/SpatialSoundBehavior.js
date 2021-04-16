// Import dependencies
import { Actor, ScriptBehavior, getActor, Vector2 } from "../ECS";
import { EntityBuilder, SpatialSound } from "../helpers";

export default class SpatialSoundBehavior extends ScriptBehavior {
    awake() {
        const { x, y } = Vector2.randomCoordInRadius(60);
        this.actor.position.set(x, y);
    }

    start() {
        const listener = getActor("player");

        this.sound = new SpatialSound("ambient-sound", this.actor, listener, {
            maxsound: 0.1, max: 100, debug: true
        });
    }

    update() {
        this.sound.check();
    }
}

ScriptBehavior.define("SpatialSoundBehavior", SpatialSoundBehavior);

EntityBuilder.define("sound:3D", () => {
    return new Actor(EntityBuilder.increment("sound"))
        .createScriptedBehavior("SpatialSoundBehavior");
});
