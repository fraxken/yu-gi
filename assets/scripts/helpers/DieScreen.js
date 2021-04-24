import { AnimatedText, Animations, Key } from "./";
import * as PIXI from "pixi.js";

function getStyle() {
    return {
        fill: "#EF5350",
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

export default class DieScreen extends PIXI.Container {
    constructor() {
        super();

        this.animatedText = new AnimatedText("You are dead... noob", getStyle(), {
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
        this.animatedText.gameObject.anchor.set(0.5);

        const style2 = getStyle();
        style2.fill = "#64FFDA";

        this.animatedText2 = new AnimatedText("Press 'ENTER' to revive!", style2, {
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
        this.animatedText2.y = 15;
        this.animatedText2.gameObject.anchor.set(0.5);
        this.animatedText.linkTo(this.animatedText2);

        this.addChild(this.animatedText);
        this.addChild(this.animatedText2);
    }

    update() {
        this.animatedText.update();
        this.animatedText2.update();

        if (game.input.wasKeyJustPressed(Key.ENTER)) {
            this.emit("cleanup");
            this.destroy({ children: true, baseTexture: true, texture: true });
        }
    }
}
