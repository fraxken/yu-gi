// Import Internal Dependencies
import { Scene } from "../ECS";
import { AnimatedText, Animations } from "../helpers";

export default class TextScene extends Scene {
    constructor() {
        super({ useLRUCache: true, debug: false });
    }

    getStyle() {
        return {
            fill: "#12d94d",
            fontFamily: "Verdana",
            fontSize: 10,
            fontVariant: "small-caps",
            fontWeight: "bold",
            letterSpacing: 1,
            lineJoin: "round",
            strokeThickness: 2,
            align: "center"
        }
    }

    awake() {
        super.awake();
        const { width, height } = game.screenSize;


        this.animatedText = new AnimatedText("bienvenue fraxken...", this.getStyle(), {
            resetOnLinkedStop: true,
            animations: [
                new Animations.WritingTextAnimation({
                    charTick: 4,
                    pauseTimeBetweenLine: 60
                }),
                new Animations.FadeTextAnimation({
                    frame: 60,
                    easing: "easeInQuad",
                    defaultState: "out"
                }),
                new Animations.MovingTextAnimation({
                    decalY: 40,
                    frame: 80,
                    easing: "easeOutQuad"
                })
            ]
        });
        this.animatedText.position.set(width / 8, height / 8);
        this.animatedText.gameObject.anchor.set(0.5);

        const style2 = this.getStyle();
        style2.fill = "#FFEB3B";

        this.animatedText2 = new AnimatedText("Press any key to start the game!", style2, {
            autoStart: false,
            animations: [
                new Animations.FadeTextAnimation({
                    frame: 60,
                    easing: "easeInQuad",
                    defaultState: "out"
                }),
                new Animations.MovingTextAnimation({
                    decalY: 60,
                    frame: 120,
                    easing: "easeOutQuad"
                })
            ]
        });
        this.animatedText2.position.set(width / 8, (height / 8) + 15);
        this.animatedText2.gameObject.anchor.set(0.5);
        this.animatedText.linkTo(this.animatedText2);

        this.addChild(this.animatedText);
        this.addChild(this.animatedText2);
    }

    update() {
        super.update();

        this.animatedText.update();
        this.animatedText2.update();
    }
}

Scene.define("text", TextScene);
