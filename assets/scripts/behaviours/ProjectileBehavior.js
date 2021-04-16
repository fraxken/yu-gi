import Actor from "../ECS/actor.class";
import ScriptBehavior from "../ECS/scriptbehavior";
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";

import * as EntityBuilder from "../helpers/entitybuilder.js";

const kDefaultFadeInFrames = 240;


export default class ProjectileBehavior extends ScriptBehavior {

    /**
     *Creates an instance of ProjectileBehavior.
     * @param {*} [options={}]
     * @memberof ProjectileBehavior
     */
    constructor(options = {}) {
        const { startPos, targetPos } = options;
        super();

        this.startPos = startPos;
        this.targetPos = targetPos;
        this.radius = 15;
    }

    awake() {
        this.sprite = this.actor.addComponent(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
            );

        this.actor.x = this.startPos.x;
        this.actor.y = this.startPos.y;
    }

    update() {
        if (!this.actor.destroyed) {
            if (this.actor.x !== this.targetPos.x || this.actor.y !== this.targetPos.y) {
                if (this.actor.x < this.targetPos.x) this.actor.moveX(1); this.sprite.scale.x = 1;
                if (this.actor.x > this.targetPos.x) this.actor.moveX(-1); this.sprite.scale.x = -1;

                if (this.actor.y < this.targetPos.y) this.actor.moveY(1);
                if (this.actor.y > this.targetPos.y) this.actor.moveY(-1);


                this.actor.applyVelocity();
                this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-die");
            }
            else {
                console.log("cleanup")
                this.actor.cleanup();
                console.log(this.actor);
            }
        }
    }
}

ScriptBehavior.define("ProjectileBehavior", ProjectileBehavior);

EntityBuilder.define("actor:projectile", (options = {}) => {
    return new Actor("projectile")
        .createScriptedBehavior(new ProjectileBehavior(options));
});
