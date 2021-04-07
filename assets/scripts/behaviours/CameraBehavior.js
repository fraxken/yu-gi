// Import dependencies
import ScriptBehavior from "../ECS/scriptbehavior";

export default class CameraBehavior extends ScriptBehavior {
    awake() {
        this.target = game.getActor("player");
        console.log(this.target);

        const { width, height } = game.app.renderer.screen;
        this.actor.position.set(width / 2, height / 2);
        this.actor.pivot.copy(this.target.position);
    }

    update() {
        // const dt = 1 - Math.exp(-deltaInMillis / 100);
        const dt = 1;
        
        const targetPivot = this.target.position;
        this.actor.pivot.x = (targetPivot.x - this.actor.pivot.x) * dt + this.actor.pivot.x;
        this.actor.pivot.y = (targetPivot.y - this.actor.pivot.y) * dt + this.actor.pivot.y;
    }
}
