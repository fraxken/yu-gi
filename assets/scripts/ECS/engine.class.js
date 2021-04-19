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
        this.app.stage.interactive = true;

        window.game = this;
        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 500,
            worldHeight: 500,
            interaction: this.app.renderer.plugins.interaction,
        });

        this.input = new Keyboard(this.app.view);
        /** @type {PIXI.ObservablePoint} */
        this.mousePosition = null;

        this.app.renderer.view.addEventListener("mousedown", () => {
            this.input.lockMouse();
        }, { once: true });

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

    /**
     * @param {!string} sceneName
     * @param  {...any} options
     */
    loadScene(sceneName, ...options) {
        const sceneInstance = Scene.cache.get(sceneName);
        if (typeof sceneInstance === "undefined") {
            throw new Error(`Unable to found scene with name '${sceneName}'`);
        }

        this.fade.out(() => {
            this._destroyRootScene();
            this._initRootScene(sceneInstance, ...options);
        });
    }

    /**
     * @param {!string} sceneName
     * @param  {...any} options
     */
    appendScene(sceneName, ...options) {
        const sceneInstance = Scene.cache.get(sceneName);
        if (typeof sceneInstance === "undefined") {
            throw new Error(`Unable to found scene with name '${sceneName}'`);
        }

        this.rootScene.add(new sceneInstance(...options));
    }

    init() {
        console.log(`[INFO] init engine`);
        this.resizeRendererToScreenSize();
        this.loadAsync(() => {
            this.loadAssets(this.app.loader, () => this._initStage());
        });
        this.emit("init");

        return this;
    }

    _initStage() {
        console.log(`[INFO] initStage start`);
        this.app.stage.addChild(this.viewport);

        // Configure viewport
        this.viewport.zoomPercent(1);
        this.viewport.wheel({ smooth: 150, lineHeight: 300 });
        this.viewport.clampZoom({ minWidth: 250, minHeight: 250, maxWidth: 500, maxHeight: 500 });

        this._initRootScene(this.defaultRootScene);
        this.app.ticker.add(this.update.bind(this));
        console.log(`[INFO] initStage end`);
    }

    /**
     * @param {!Scene} sceneInstance
     * @param {...any} options
     */
    _initRootScene(sceneInstance, ...options) {
        this.rootScene = new sceneInstance(...options);

        const cursorSprite = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#000"), 1)
            .drawCircle(0, 0, 5)
            .endFill();
        // const cursorSprite = new PIXI.Sprite(getTexture("adventurer", "adventurer-air-attack-3-end-00.png"));
        // cursorSprite.anchor.set(0.5, 0.5);

        this.app.stage.on("pointermove", (event) => {
            this.mousePosition = event.data.global;

            const localPos = this.viewport.toWorld(this.mousePosition.x, this.mousePosition.y);
            cursorSprite.position.set(localPos.x, localPos.y);
        });

        const fadeGraphic = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#000"), 1)
            .drawRect(0, 0, window.innerWidth, window.innerHeight)
            .endFill();

        this.fade = new Fade(fadeGraphic, {
            frame: 30, delayIn: 20, delayOut: 20, defaultState: "in"
        });

        this.viewport.addChild(this.rootScene);

        this.rootScene.addChild(cursorSprite);
        this.rootScene.addChild(fadeGraphic);
        this.rootScene.init();
    }

    _destroyRootScene() {
        this.fade.displayObject.destroy({ children: true });
        this.fade = null;
        this.rootScene.cleanup();

        this.viewport.removeChild(this.rootScene);
    }

    update(delta = 0) {
        if (this.fade !== null){
            this.fade.update();
        }

        this.emit("update", delta);
        this.input.update(delta);
    }

    resizeRendererToScreenSize() {
        console.log(`[INFO] resize renderer triggered!`);
        const { innerWidth, innerHeight } = window;

        this.app.renderer.resize(innerWidth, innerHeight);
        this.viewport.resize(innerWidth, innerHeight);
    }
}
