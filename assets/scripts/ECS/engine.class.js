// Import dependencies
import * as PIXI from "pixi.js";
import Keyboard from "./input.class.js";
import Scene from "./scene.class.js";

export default class Engine extends PIXI.utils.EventEmitter {
    constructor() {
        super();

        this.assetsToLoad = [];
        this.app = new PIXI.Application({
            autoResize: true,
            resolution: devicePixelRatio
        });
        this.app.renderer.backgroundColor = 0xFF00FF;
        this.input = new Keyboard();

        document.body.appendChild(app.view);
    }
    
    registerAsset(assetURL) {
        this.assetsToLoad.push(assetURL);

        return this;
    }

    init() {
        const loader = this.app.loader;
        for (const url of this.assetsToLoad) {
            loader.add(url);
        }
        
        loader.load(this.awake.bind(this));
        window.addEventListener("resize", this.resize.bind(this));

        return this;
    }

    awake() {
        this.emit("awake");

        this.currentScene = new Scene().awake();
        this.app.stage.addChild(this.currentScene);
        this.resize();
        this.app.ticker.add((delta) => this.update(delta));
    }

    update(delta = 0) {
        this.emit("update", delta);

        this.input.update();
        this.currentScene.update();
    }

    resize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    // const getOneTexture = (url) => app.loader.resources[url].texture;
    getAtlasTexture(url, name) {
        return app.loader.resources[url].textures[name];
    }
}