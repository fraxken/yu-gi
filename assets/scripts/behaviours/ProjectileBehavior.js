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
        this.radius = 5;
    }

    awake() {
        this.sprite = this.actor.addComponent(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
            );

        this.actor.x = this.startPos.x;
        this.actor.y = this.startPos.y;

        console.log(this.actor);
    }

    update() {
        if (!this.actor._destroyed) {
            if (this.actor.x !== this.targetPos.x || this.actor.y !== this.targetPos.y) {
                if (this.actor.x < this.targetPos.x) this.actor.moveX(1); this.sprite.scale.x = -1;
                if (this.actor.x > this.targetPos.x) this.actor.moveX(-1); this.sprite.scale.x = 1;

                if (this.actor.y < this.targetPos.y) this.actor.moveY(1);
                if (this.actor.y > this.targetPos.y) this.actor.moveY(-1);


                this.actor.applyVelocity();
            }
            else {
                this.actor.destroy();
            }

            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-die");
        }
    }
}

ScriptBehavior.define("ProjectileBehavior", ProjectileBehavior);

EntityBuilder.define("actor:projectile", (options = {}) => {
    return new Actor("projectile")
        .createScriptedBehavior(new ProjectileBehavior(options));
});
