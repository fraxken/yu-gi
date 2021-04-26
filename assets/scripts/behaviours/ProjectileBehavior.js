
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import { Actor, ScriptBehavior, getActor, boxesIntersect } from "../ECS";
import { EntityBuilder } from "../helpers";

export default class ProjectileBehavior extends ScriptBehavior {

    /**
     *Creates an instance of ProjectileBehavior.
     * @param {*} [options={}]
     * @memberof ProjectileBehavior
     */
    constructor(options = {
        startPos: {
            x: 0,
            y: 0
        },
        targetPos: {
            x: 0,
            y: 0
        },
        stat: {
            fadeInFrames: 240,
            radius: 15,
            damage: 2,
            missRatio: 0.45
        },
        sprites: {
            name: "adventurer",
            start: "adventurer-idle",
            while: "adventurer-run",
            end: "adventurer-die"
        }
    }) {
        super();

        this.startPos = options.startPos;
        this.targetPos = options.targetPos;
        this.fadeInFrames = options.fadeInFrames;
        this.radius = options.stat.radius;
        this.damage = options.stat.damage;
        this.missRatio = options.stat.missRatio;
        this.sprites = options.sprites;
        this.targetPos.x = Math.round(this.targetPos.x);
        this.targetPos.y = Math.round(this.targetPos.y);
    }

    awake() {
        console.log(`Projectile with name: ${this.actor.name} created`);
        this.sprite = this.actor.addComponent(
            new AnimatedSpriteEx(this.sprites.name, { defaultAnimation: this.sprites.start })
        );

        this.actor.pos = this.startPos;
        this.tick = 0;
        this.target = getActor("player");
    }

    die(cause) {
        console.log("projectile die because: ", cause);

        this.actor.cleanup();
    }

    hit() {
        const isCritical = Math.random() < 0.05;
        const damageToApply = isCritical ? this.damage * 2 : this.damage;

        const script = this.target.getScriptedBehavior("PlayerBehavior");
        const isHitting = Math.random() < this.missRatio ? false : true;
        if (isHitting) {
            script.sendMessage("takeDamage", damageToApply, { isCritical });
        }
        else {
            script.sendMessage("takeDamage", 0, false);
        }


        this.die("hit player");
    }

    update() {
        this.tick++;

        if (boxesIntersect(this.actor, this.target)) {
            this.hit();
        }
        else if (this.tick >= this.fadeInFrames) {
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
            this.sprite.playAnimation(this.actor.moving ? this.sprites.while : this.sprites.end);
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
