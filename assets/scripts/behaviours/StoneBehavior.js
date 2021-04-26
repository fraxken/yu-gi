import PIXI from "pixi.js";

// Import dependencies
import { ScriptBehavior, getActor, Components } from "../ECS";
import AnimatedSpriteEx from "../ECS/components/animatedsprite.class";
import { AnimatedText, Animations } from "../helpers";

import { Inputs } from "../keys";

export default class StoneBehavior extends ScriptBehavior {
    static DistanceToActive = 50;
    static DisabledColor = "#FFFDE7";

    static style() {
        return {
            fill: "#E3F2FD",
            fontFamily: "Verdana",
            fontSize: 8,
            fontVariant: "small-caps",
            fontWeight: "bold",
            letterSpacing: 1,
            lineJoin: "round",
            strokeThickness: 2,
            align: "center"
        }
    }

    awake() {
        this.active = game.state.getState("stoneEnabled");
        // console.log("ACTIVE ?: ", this.active);

        const spriteComponent = new Components.AnimatedSpriteEx("stele", {
            defaultAnimation: "idle"
        });
        spriteComponent.anchor.set(0, 0);

        /** @type {AnimatedSpriteEx} */
        this.sprite = this.actor.addComponent(spriteComponent);
        if (this.active) {
            this.retract();
        }

        this.stoneHelperText = new AnimatedText(`Activated!`, StoneBehavior.style(), {
            autoStart: false,
            animations: [
                new Animations.FadeTextAnimation({
                    frame: 45,
                    easing: "easeInQuad",
                    defaultState: "out"
                }),
                new Animations.MovingTextAnimation({
                    decalY: 30,
                    frame: 75,
                    easing: "easeOutQuad"
                })
            ]
        });
        this.stoneHelperText.gameObject.anchor.set(0.5);
        this.stoneHelperText.position.set(0, -25);
        this.actor.addChild(this.stoneHelperText);
    }

    start() {
        this.target = getActor("player");
        this.stoneControlScript = getActor("stoneControl").getScriptedBehavior("StoneControlBehavior");
        this.stoneControlScript.sendMessage("registerStone", this.actor);
    }

    retract() {
        this.sprite.playAnimation("activate", { force: true, loop: false });
    }

    disableStone() {
        this.active = false;
        this.stoneHelperText.reset();
        this.sprite.playAnimation("disabled", { loop: false });
    }

    activateStone() {
        this.stoneHelperText.start();
        this.stoneHelperText.once("stop", () => this.stoneHelperText.reset());
        this.sprite.playAnimation("enabled", { loop: false });

        this.active = true;
        this.stoneControlScript.sendMessage("activateStone", this.actor.name);
    }

    update() {
        if (this.active) {
            return;
        }

        this.sprite.playAnimation(this.active ? "idleEnabled" : "idle");
        this.stoneHelperText.update();
        if (this.active) {
            return;
        }

        const distance = this.actor.pos.distanceTo(this.target.pos);
        if (Inputs.use() && distance < StoneBehavior.DistanceToActive) {
            this.activateStone();
        }
    }
}

ScriptBehavior.define("StoneBehavior", StoneBehavior);
