// Import third-party dependencies
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

// Import internal dependencies
import Keyboard from "../helpers/input.class.js";
import Scene from "./scene.class.js";
import State from "./state.class";
import AssetLoader from "./assetloader.class";
import Fade from "./math/fade";
import TiledSet from "./components/tiledset";
import TiledMap from "./components/tiledmap";

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
        this.waitingScenes = [];

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
            // this.input.lockMouse();
        }, { once: true });

        this.defaultRootScene = options.defaultScene;
        /** @type {Scene} */
        this.rootScene = null;

        document.body.appendChild(this.app.view);
        window.addEventListener("resize", this.resizeRendererToScreenSize.bind(this));
    }

    get resolution() {
        return PIXI.settings.RESOLUTION * 2;
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
        console.clear();
        const sceneInstance = Scene.cache.get(sceneName);
        if (typeof sceneInstance === "undefined") {
            throw new Error(`Unable to found scene with name '${sceneName}'`);
        }
        console.log(`[DEBUG] Loading new scene '${sceneName}'`);

        this.fade.out(() => {
            this._destroyRootScene();

            // Reset components cache
            TiledSet.cache = [];
            TiledSet.loaded.clear();
            TiledMap.sharedCollisionLayer = null;
            this.rootScene = null;

            this._initRootScene(sceneInstance, ...options);
        });
    }

    /**
     * @param {!string} sceneName
     * @param {object} [options]
     */
    appendScene(sceneName, options = {}) {
        const sceneInstance = Scene.cache.get(sceneName);
        if (typeof sceneInstance === "undefined") {
            throw new Error(`Unable to found scene with name '${sceneName}'`);
        }
        const params = options.params || [];
        const loaded = options.loaded || null;

        if (this.rootScene === null || this.rootScene.constructor.name !== sceneInstance.constructor.name) {
            this.waitingScenes.push({
                scene: new sceneInstance(...params),
                callback: loaded
            });
        }
        else {
            const scene = this.rootScene.add(new sceneInstance(...params));
            if (loaded !== null) {
                loaded(scene);
            }
        }
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
        // this.viewport.clampZoom({ minWidth: 250, minHeight: 250, maxWidth: 500, maxHeight: 500 });

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
        this.viewport.addChild(this.rootScene);

        for (const { scene, callback } of this.waitingScenes) {
            this.rootScene.add(scene);
            callback(scene);
        }
        this.waitingScenes = [];
        console.log("[INFO] Waiting scenes added to current scene!");

        this.cursorSprite = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#000"), 1)
            .drawCircle(0, 0, 5)
            .endFill();
        this.cursorSprite.zIndex = 29;
        // const cursorSprite = new PIXI.Sprite(getTexture("adventurer", "adventurer-air-attack-3-end-00.png"));
        // cursorSprite.anchor.set(0.5, 0.5);

        this.app.stage.on("pointermove", (event) => {
            this.mousePosition = event.data.global;

            const localPos = this.viewport.toWorld(this.mousePosition.x, this.mousePosition.y);
            this.cursorSprite.position.set(localPos.x, localPos.y);
        });

        const fadeGraphic = new PIXI.Graphics()
            .beginFill(PIXI.utils.string2hex("#000"), 1)
            .drawRect(0, 0, window.innerWidth, window.innerHeight)
            .endFill();
        fadeGraphic.zIndex = 30;

        this.fade = new Fade(fadeGraphic, {
            frame: 30, delayIn: 20, delayOut: 20, defaultState: "in"
        });

        this.rootScene.addChild(this.cursorSprite);
        this.rootScene.addChild(fadeGraphic);
        this.rootScene.init(this);
    }

    _destroyRootScene() {
        this.app.stage.removeAllListeners("pointermove");

        this.cursorSprite.destroy();
        this.fade.displayObject.destroy({ children: true });
        this.fade = null;
        this.rootScene.cleanup();

        this.viewport.removeChild(this.rootScene);
    }

    update(delta = 0) {
        if (this.fade !== null){
            this.fade.update();
        }
        if (this.rootScene !== null) {
            this.rootScene.update();
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
