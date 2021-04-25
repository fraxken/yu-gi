
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import { Actor, ScriptBehavior, getActor } from "../ECS";
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
        this.targetPos.x = Math.round(this.targetPos.x);
        this.targetPos.y = Math.round(this.targetPos.y);
        this.radius = 15;
    }

    awake() {
        console.log(`Projectile with name: ${this.actor.name} created`);
        this.sprite = this.actor.addComponent(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );

        this.actor.pos = this.startPos;
        this.tick = 0;
        this.target = getActor("player");
    }

    die(cause) {
        console.log("projectile die because: ", cause);

        this.actor.cleanup();
    }

    update() {
        this.tick++;

        if (Math.round(this.actor.x) === Math.round(this.target.x)
        && Math.round(this.actor.y) === Math.round(this.target.y)) {
            this.target.getScriptedBehavior("PlayerBehavior").sendMessage("takeDamage", 2);
            this.die("hit player");
        }
        else if (this.tick >= kDefaultFadeInFrames) {
            this.die("timeout");
        }
        else if (Math.round(this.actor.x) !== this.targetPos.x || Math.round(this.actor.y) !== this.targetPos.y) {
            if (this.actor.x < this.targetPos.x) {
                this.actor.moveX(1);
            } else if (this.actor.x > this.targetPos.x) {
                this.actor.moveX(-1);
            }

            if (this.actor.y < this.targetPos.y) {
                this.actor.moveY(1);
            }
            else if (this.actor.y > this.targetPos.y) {
                this.actor.moveY(-1);
            }

            this.actor.applyVelocity();
            this.sprite.playAnimation(this.actor.moving ? "adventurer-run" : "adventurer-die");
        }
        else {
            this.die("hit targeted position");
        }
    }
}

ScriptBehavior.define("ProjectileBehavior", ProjectileBehavior);

EntityBuilder.define("actor:projectile", (options = {}) => {
    return new Actor(EntityBuilder.increment("projectile"))
        .createScriptedBehavior(new ProjectileBehavior(options));
});
