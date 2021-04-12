// Import dependencies
import * as PIXI from "pixi.js";

import Actor from "../ECS/actor.class";
import ScriptBehavior from "../ECS/scriptbehavior";
import AnimatedSpriteEx from "../ECS/animatedsprite.class";
import { getSpritesheet } from "../ECS/helpers";

import Timer from "../helpers/timer.class";
import * as EntityBuilder from "../helpers/entitybuilder.js";
import { Key } from "../helpers/input.class";

const creatureRange = {
  position: {
    y: 50,
    x: 50
  },
  radius: 20
}

export default class CreatureBehavior extends ScriptBehavior {

    constructor() {
        super();

        this.nextPos = {
            x: null,
            y: null
        };
        this.isInAction = false;
        this.action = null;
        this.time = new Timer(60);
    }

    awake() {
        this.actor.addSprite(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
            );

        this.actor.y = creatureRange.position.y;
        this.actor.x = creatureRange.position.x;
    }

    update() {
        if (!this.isInAction) {
            if (!this.action) {
                this.isInAction = true;
                this.action = "DEPLACEMENT";
                const r = creatureRange.radius * Math.sqrt(Math.random())
                const theta = Math.random() * 2 * Math.PI
                const x = Math.round(creatureRange.position.x + r * Math.cos(theta));
                const y = Math.round(creatureRange.position.y + r * Math.sin(theta));

                this.nextPos.x = x;
                this.nextPos.y = y;
                this.actor.y = this.actor.y < y ? this.actor.y +1: this.actor.y -1;
                this.actor.x = this.actor.x < x ? this.actor.x +1: this.actor.x -1;
            }
            else {
                if (this.time.walk()) {
                    this.isInAction = true;
                    this.action = "DEPLACEMENT";
                    const r = creatureRange.radius * Math.sqrt(Math.random())
                    const theta = Math.random() * 2 * Math.PI
                    const x = Math.round(creatureRange.position.x + r * Math.cos(theta));
                    const y = Math.round(creatureRange.position.y + r * Math.sin(theta));

                    this.nextPos.x = x;
                    this.nextPos.y = y;
                    this.actor.y = this.actor.y < y ? this.actor.y +1: this.actor.y -1;
                    this.actor.x = this.actor.x < x ? this.actor.x +1: this.actor.x -1;
                }
            }
        }
        else {
            if (this.action === "DEPLACEMENT") {
                if (this.nextPos.x === this.actor.x && this.nextPos.y === this.actor.y) {
                    this.action = null;
                    this.nextPos.x = null;
                    this.nextPos.y = null;
                    this.isInAction = false;
                }
                else {
                    if (this.nextPos.x !== this.actor.x) this.actor.x = this.actor.x < this.nextPos.x ? this.actor.x +1: this.actor.x -1;
                    if (this.nextPos.y !== this.actor.y) this.actor.y = this.actor.y < this.nextPos.y ? this.actor.y +1: this.actor.y -1;
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
