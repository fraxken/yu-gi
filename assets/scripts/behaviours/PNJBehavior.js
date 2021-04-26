
import { Inputs } from "../keys";
import { ScriptBehavior, Components, getActor } from "../ECS";
import { AnimatedText, Animations } from "../helpers";

export default class PNJBehavior extends ScriptBehavior {
    static DistanceToOpen = 80;

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

    constructor(type = null) {
        super();

        // TODO: can be useful later if we have different kind of PNJ
        this.type = type;

        this.open = false;
        this.shopTitleOpen = false;
    }

    awake() {
        this.shopTitle = new AnimatedText(`Shop <Defense>`, PNJBehavior.titleStype(), {
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
        this.shopTitle.gameObject.anchor.set(0);
        this.shopTitle.position.set(-10, -10);
        this.actor.addChild(this.shopTitle);

        this.sprite = this.actor.addComponent(
            new Components.AnimatedSpriteEx("adventurer", { defaultAnimation: "adventurer-idle" })
        );
        this.sprite.position.set(this.actor.width / 4, this.actor.height / 4);
    }

    start() {
        this.target = getActor("player");
    }

    showShopTitle() {
        this.shopTitleOpen = true;
        this.shopTitle.start();
    }

    update() {
        this.shopTitle.update();

        const distance = this.actor.pos.distanceTo(this.target.pos);
        const inArea = distance < PNJBehavior.DistanceToOpen;

        if (inArea && !this.shopTitleOpen) {
            this.shopTitleOpen = true;
            this.shopTitle.start();
        }
        else if (!inArea && this.shopTitleOpen) {
            this.shopTitleOpen = false;
            this.shopTitle.reset();
        }

        if (Inputs.use() && !this.open && inArea) {
            hudevents.emit("store", true);
            this.open = true;
        }
        else if (this.open && !inArea) {
            hudevents.emit("store", false);
            this.open = false;
        }
    }

    destroy() {
        if (this.open) {
            hudevents.emit("store", false);
        }
    }
}

ScriptBehavior.define("PNJBehavior", PNJBehavior);
