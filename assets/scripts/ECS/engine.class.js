// Import dependencies
import * as PIXI from "pixi.js";
import Keyboard from "../helpers/input.class.js";
import Scene from "./scene.class.js";

export default class Engine extends PIXI.utils.EventEmitter {
    constructor(options = Object.create(null)) {
        super();

        this.assets = new Map();
        this.state = {};

        this.app = new PIXI.Application({
            autoResize: true,
            resolution: devicePixelRatio
        });
        this.app.renderer.backgroundColor = 0xFF00FF;
        this.input = new Keyboard(this.app.view);
        this.currentScene = new Scene(options.defaultScene);

        document.body.appendChild(this.app.view);
        window.game = this;
    }

    setState(keyName, value = null) {
        this.state[keyName] = value;
        this.emit(`state:${keyName}`, value);
    }
    
    registerAsset(name, assetURL) {
        this.assets.set(name, assetURL);

        return this;
    }

    getAsset(name) {
        return this.assets.get(name);
    }

    init() {
        const loader = this.app.loader;
        for (const [name, url] of this.assets.entries()) {
            loader.add(name, url);
        }
        
        loader.load(this.awake.bind(this));
        window.addEventListener("resize", this.resize.bind(this));

        return this;
    }

    awake() {
        this.currentScene.awake();
        this.app.stage.addChild(this.currentScene);
        this.resize();

        this.emit("awake");
        this.app.ticker.add((delta) => this.update(delta));
    }

    update(delta = 0) {
        this.input.update(delta);
        this.currentScene.update(delta);

        this.emit("update", delta);
    }

    resize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }
}