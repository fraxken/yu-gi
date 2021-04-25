import PIXI from "pixi.js";

// Import dependencies
import { ScriptBehavior, getActor } from "../ECS";
import { AnimatedText, Animations } from "../helpers";

import { Inputs } from "../keys";

export default class StoneBehavior extends ScriptBehavior {
    static DistanceToActive = 50;
    static DisabledColor = "#FFFDE7";

    static titleStype() {
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

    constructor() {
        super({
            enabled: "dungeon.enabled"
        });
    }

    awake() {
        this.active = this.enabled;
        this.stoneHelperText = new AnimatedText(`Activated!`, StoneBehavior.titleStype(), {
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

        if (this.active) {
            this.transformGraphic();
        }
        else {
            this.transformGraphic(StoneBehavior.DisabledColor);
        }
    }

    start() {
        this.target = getActor("player");
        this.stoneControlScript = getActor("stoneControl").getScriptedBehavior("StoneControlBehavior");
        this.stoneControlScript.sendMessage("registerStone", this.actor);

        /** @type {PIXI.Graphics} */
        this.graphic = this.actor.children[0];
    }

    transformGraphic(color = "#EF5350") {
        if (this.graphic) {
            const { width, height } = this.graphic;
            this.graphic.clear()
                .beginFill(PIXI.utils.string2hex(color), 0.6)
                .drawRect(0, 0, width, height)
                .endFill();
        }
    }

    disableStone() {
        this.active = false;
        this.transformGraphic(StoneBehavior.DisabledColor);
        this.stoneHelperText.reset();
    }

    activateStone() {
        this.stoneHelperText.start();
        this.stoneHelperText.once("stop", () => this.stoneHelperText.reset());
        this.transformGraphic();

        this.active = true;
        this.stoneControlScript.sendMessage("activateStone", this.actor.name);
    }

    update() {
        if (this.enabled) {
            return;
        }
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
