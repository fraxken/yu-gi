// Import third-party dependencies
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

// Import internal dependencies
import Keyboard from "../helpers/input.class.js";
import Scene from "./scene.class.js";
import State from "./state.class";
import AssetLoader from "./assetloader.class";
import Fade from "./math/fade";

export default class Engine extends AssetLoader {
    /**
     * @param {object} [options]
     * @param {State} [options.state]
     * @param {boolean} [options.debug=false]
     * @param {any} [options.defaultScene]
     */
    constructor(options = Object.create(null)) {
        super();

        // TODO: use this for scene loading
        this.alreadyStarted = false;
        this.debug = options.debug || false;
        this.state = options.state || new State({});

        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            autoResize: true,
            antialias: false
        });

        window.game = this;
        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 500,
            worldHeight: 500,
            interaction: this.app.renderer.plugins.interaction,
        });
        this.input = new Keyboard(this.app.view);

        this.defaultRootScene = options.defaultScene;
        /** @type {Scene} */
        this.rootScene = null;

        document.body.appendChild(this.app.view);
        window.addEventListener("resize", this.resizeRendererToScreenSize.bind(this));
    }

    get screenSize() {
        const { width, height } = this.app.renderer.view;

        return { width, height };
    }

    get stage() {
        return this.app.stage;
    }

    get renderer() {
        return this.app.renderer;
    }

    loadScene(sceneName) {
        // TODO
    }

    appendScene(sceneName) {
        // TODO
    }

    init() {
        console.log(`[INFO] init engine`);
        this.resizeRendererToScreenSize();
        this.loadAssets(this.app.loader, () => this.awake());
        this.emit("init");

        return this;
    }

    awake() {
        console.log(`[INFO] 'awake' phase start`);
        this.rootScene = new this.defaultRootScene();
        const fadeGraphic = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#000"), 1)
            .drawRect(0, 0, window.innerWidth, window.innerHeight)
            .endFill();

        this.fade = new Fade(fadeGraphic, {
            frame: 30, delayIn: 20, delayOut: 20, defaultState: "in"
        });
        this.app.stage.addChild(this.viewport);

        // Configure viewport
        this.viewport.zoomPercent(1);
        this.viewport.wheel({ smooth: 150, lineHeight: 300 });
        this.viewport.clampZoom({ minWidth: 250, minHeight: 250, maxWidth: 500, maxHeight: 500 });
        this.viewport.addChild(this.rootScene);
        this.rootScene.addChild(fadeGraphic);

        this.rootScene.awake();
        this.emit("awake");
        console.log(`[INFO] 'awake' phase done`);

        this.start();
    }

    start() {
        console.log(`[INFO] 'start' phase start`);
        this.rootScene.start();
        this.emit("start");
        console.log(`[INFO] 'start' phase done`);

        this.app.ticker.add((delta) => this.update(delta));
    }

    update(delta = 0) {
        this.fade.update();
        this.input.update(delta);
        this.rootScene.update(delta);

        this.emit("update", delta);
    }

    resizeRendererToScreenSize() {
        console.log(`[INFO] resize renderer triggered!`);
        const { innerWidth, innerHeight } = window;

        this.app.renderer.resize(innerWidth, innerHeight);
        this.viewport.resize(innerWidth, innerHeight);
    }
}
