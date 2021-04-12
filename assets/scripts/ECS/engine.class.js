// Import third-party dependencies
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

// Import internal dependencies
import Keyboard from "../helpers/input.class.js";
import Scene from "./scene.class.js";
import State from "./state.class";
import AssetLoader from "./assetloader.class";

export default class Engine extends AssetLoader {
    /**
     * @param {object} [options]
     * @param {State} [options.state]
     * @param {boolean} [options.debug=false]
     * @param {any} [options.defaultScene]
     */
    constructor(options = Object.create(null)) {
        super();
        this.debug = options.debug || false;
        this.state = options.state || new State({});

        this.app = new PIXI.Application({
            autoResize: true,
            resolution: devicePixelRatio
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

    get stage() {
        return this.app.stage;
    }

    get renderer() {
        return this.app.renderer;
    }

    init() {
        console.log(`[INFO] init engine`);
        this.rootScene = new Scene(this.defaultRootScene);
        
        this.resizeRendererToScreenSize();
        this.loadAssets(this.app.loader, () => this.awake());

        return this;
    }

    awake() {
        console.log(`[INFO] 'awake' phase start`);
        this.app.stage.addChild(this.viewport);

        // Configure viewport
        this.viewport.zoomPercent(1);
        this.viewport.wheel({ smooth: 150, lineHeight: 300 });
        this.viewport.addChild(this.rootScene);
        
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