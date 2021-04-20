// Import dependencies
import { ScriptBehavior, getActor, Timer } from "../ECS";
import { Key } from "../helpers";

export default class DungeonDoorBehavior extends ScriptBehavior {
    awake() {
        this.teleporting = false;
    }

    start() {
        this.target = getActor("player");
    }

    warp() {
        this.teleporting = true;

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        script.playable = false;
        console.log("load scene");
        game.loadScene("dungeon");
    }

    update() {
        if (this.teleporting) {
            return;
        }

        const distance = this.actor.pos.distanceTo(this.target.pos);
        if (distance < 50 && game.input.wasKeyJustPressed(Key.E)) {
            this.warp();
        }
    }
}

ScriptBehavior.define("DungeonDoorBehavior", DungeonDoorBehavior);
