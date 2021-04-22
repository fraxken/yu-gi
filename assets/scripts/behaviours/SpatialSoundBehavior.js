// Import dependencies
import { Actor, ScriptBehavior, getActor, Vector2 } from "../ECS";
import { EntityBuilder, SpatialSound } from "../helpers";

export default class SpatialSoundBehavior extends ScriptBehavior {
    constructor(soundName, radius = 100) {
        super();

        this.soundRadius = radius;
        this.soundName = soundName;
    }

    awake() {
        const { x, y } = Vector2.randomCoordInRadius(60);
        this.actor.position.set(x, y);
    }

    start() {
        const listener = getActor("player");

        this.sound = new SpatialSound(this.soundName, this.actor, listener, {
            maxsound: 0.5, max: this.soundRadius, debug: true
        });
    }

    update() {
        this.sound.check();
    }
}

ScriptBehavior.define("SpatialSoundBehavior", SpatialSoundBehavior);

EntityBuilder.define("sound:3D", (soundName, radius) => {
    return new Actor(EntityBuilder.increment("sound"))
        .createScriptedBehavior("SpatialSoundBehavior", soundName, radius);
});
