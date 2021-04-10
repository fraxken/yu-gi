// Import dependencies
import Actor from "../ECS/actor.class";
import ScriptBehavior from "../ECS/scriptbehavior";

import * as EntityBuilder from "../helpers/entitybuilder.js";

export default class CameraBehavior extends ScriptBehavior {
    awake() {
        this.target = game.getActor("player");
        
        const playerBehavior = this.target.getScriptedBehavior("PlayerBehavior");
        playerBehavior.sendMessage("cameraInit");

        const { width, height } = game.app.renderer.screen;

        this.actor.position.set(width / 2, height / 2);
        this.actor.pivot.x = this.target.x;
        this.actor.pivot.y = this.target.y;
    }

    update() {
        // const dt = 1 - Math.exp(-deltaInMillis / 100);
        const dt = 1;
        
        const targetPivot = this.target.position;
        this.actor.pivot.x = (targetPivot.x - this.actor.pivot.x) * dt + this.actor.pivot.x;
        this.actor.pivot.y = (targetPivot.y - this.actor.pivot.y) * dt + this.actor.pivot.y;
    }
}

EntityBuilder.define("actor:camera", () => {
    return new Actor("camera")
        .addScriptedBehavior(new CameraBehavior());
});
