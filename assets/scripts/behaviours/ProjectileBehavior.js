
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import { Actor, ScriptBehavior, Timer } from "../ECS";
import { EntityBuilder } from "../helpers";

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
        this.delayToFadeIn = new Timer(kDefaultFadeInFrames, { autoStart: true, keepIterating: false });
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
            if (this.delayToFadeIn.walk()) {
                this.actor.cleanup();
            } else {
                if (this.actor.x !== Math.round(this.targetPos.x) || this.actor.y !== Math.round(this.targetPos.y)) {
                    if (this.actor.x < Math.round(this.targetPos.x)) {
                        this.actor.moveX(1); this.sprite.scale.x = 1;
                    } else if (this.actor.x > Math.round(this.targetPos.x)) {
                        this.actor.moveX(-1); this.sprite.scale.x = -1;
                    }

                    if (this.actor.y < Math.round(this.targetPos.y)) {
                        this.actor.moveY(1);
                    }
                    else if (this.actor.y > Math.round(this.targetPos.y)) {
                        this.actor.moveY(-1);
                    }

                    this.actor.applyVelocity();
                    this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-die");
                }
                else {
                    this.actor.cleanup();
                }
            }
        }
    }
}

ScriptBehavior.define("ProjectileBehavior", ProjectileBehavior);

EntityBuilder.define("actor:projectile", (options = {}) => {
    return new Actor("projectile")
        .createScriptedBehavior(new ProjectileBehavior(options));
});
