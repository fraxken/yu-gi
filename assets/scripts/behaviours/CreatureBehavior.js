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
    y: 100,
    x: 200
  },
  minY: -100,
  maxY: 80,
  minX: 20,
  maxX: 100
}

export default class CreatureBehavior extends ScriptBehavior {
    constructor() {
        super();

        this.lastAction = null;
        this.time = new Timer(60);
    }

    awake() {
        this.actor.addSprite(
            new AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );

        console.log("Creature test sprite width: ", this.sprite.width);
        console.log("Creature sprite height: ", this.sprite.height);

        this.actor.y = creatureRange.position.y;
        this.actor.x = creatureRange.position.x;
    }

    update() {
        if (this.actor.y === creatureRange.position.y && this.actor.x === creatureRange.position.x) {
          this.lastAction = "start";
        }
        
        if (this.lastAction === "start" || this.lastAction === "getUp") {
          if (this.actor.y !== creatureRange.minY) {
            this.actor.y = this.actor.y > creatureRange.minY ? this.actor.y -1: this.actor.y +1;
          }

          if (this.actor.y === creatureRange.minY) {
            this.lastAction = "getDown";
          }
        }

        if (this.lastAction === "getDown") {
          console.log("up");
          if (this.actor.y !== creatureRange.maxY) {
            this.actor.y = this.actor.y < creatureRange.maxY ? this.actor.y +1: this.actor.y -1;
          }

          if (this.actor.y === creatureRange.maxY) {
            this.lastAction = "getUp";
          }
        }

        this.sprite.playAnimation(this.hasVelocity ? "adventurer-run" : "adventurer-idle");
    }
}

EntityBuilder.define("actor:creature", () => {
    return new Actor("creature")
        .addScriptedBehavior(new CreatureBehavior());
});
