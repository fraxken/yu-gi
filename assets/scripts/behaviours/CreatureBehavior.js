// Import dependencies
import * as PIXI from "pixi.js";

import Actor from "../ECS/actor.class";
import ScriptBehavior from "../ECS/scriptbehavior";
import AnimatedSpriteEx from "../ECS/animatedsprite.class";
import { getSpritesheet } from "../ECS/helpers";

import Timer from "../helpers/timer.class";
import * as EntityBuilder from "../helpers/entitybuilder.js";
import { Key } from "../helpers/input.class";

const kHandicapForDeplacement = 120;

export default class CreatureBehavior extends ScriptBehavior {

    constructor() {
        super();

        const r = 200 * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        this.position = {
            x: Math.round(0 + r * Math.cos(theta)),
            y: Math.round(0 + r * Math.sin(theta))
        };
        this.nextPos = {
            x: null,
            y: null
        };
        this.radius = 40;
        this.isInAction = false;
        this.action = null;
        this.time = new Timer(60);
    }

    awake() {
        this.actor.addSprite(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
            );

        this.actor.y = this.position.y;
        this.actor.x = this.position.x;
    }

    execute() {
        if (this.action === "DEPLACEMENT") {
            if (this.nextPos.x === this.actor.x && this.nextPos.y === this.actor.y) {
                this.action = null;
                this.nextPos.x = null;
                this.nextPos.y = null;
                this.isInAction = false;

                this.time = new Timer(120);
            }
            else {
                if (this.actor.x !== this.nextPos.x) this.actor.x = this.actor.x < this.nextPos.x ? this.actor.x +1: this.actor.x -1;
                if (this.actor.y !== this.nextPos.y) this.actor.y = this.actor.y < this.nextPos.y ? this.actor.y +1: this.actor.y -1;
            }
        }
    }

    update() {
        if (!this.isInAction) {
            if (this.time.walk()) {
                this.isInAction = true;
                this.action = "DEPLACEMENT";
                const r = this.radius * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const x = Math.round(this.position.x + r * Math.cos(theta));
                const y = Math.round(this.position.y + r * Math.sin(theta));

                this.nextPos.x = x;
                this.nextPos.y = y;
                this.execute();
            }
        }
        else {
            if (this.action === "DEPLACEMENT") {
                if (this.nextPos.x === this.actor.x && this.nextPos.y === this.actor.y) {
                    this.action = null;
                    this.nextPos.x = null;
                    this.nextPos.y = null;
                    this.isInAction = false;

                    this.time = new Timer(kHandicapForDeplacement);
                }
                else {
                    this.execute();
                }
            }
        }

        this.sprite.playAnimation(this.hasVelocity ? "adventurer-run" : "adventurer-idle");
    }
}

EntityBuilder.define("actor:creature", () => {
    return new Actor("creature")
        .addScriptedBehavior(new CreatureBehavior());
});
