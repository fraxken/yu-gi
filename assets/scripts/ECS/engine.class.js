// Import dependencies
import * as PIXI from "pixi.js";
import Keyboard from "../helpers/input.class.js";
import Scene from "./scene.class.js";
import State from "./state.class";

export default class Engine extends PIXI.utils.EventEmitter {
    /**
     * @param {object} [options]
     * @param {State} [options.state]
     * @param {boolean} [options.debug=false]
     */
    constructor(options = Object.create(null)) {
        super();

        this.assets = new Map();
        this.debug = options.debug || false;
        this.state = options.state || new State({});

        this.app = new PIXI.Application({
            autoResize: true,
            resolution: devicePixelRatio
        });
        window.game = this;
        
        this.input = new Keyboard(this.app.view);
        this.currentScene = new Scene(options.defaultScene);

        document.body.appendChild(this.app.view);
        window.addEventListener("resize", this.resize.bind(this));
    }

    get stage() {
        return this.app.stage;
    }

    get renderer() {
        return this.app.renderer;
    }
    
    registerAsset(name, assetURL) {
        this.assets.set(name, assetURL);

        return this;
    }

    getAsset(name) {
        return this.assets.get(name);
    }

    init() {
        console.log(`[DEBUG] init engine`);
        const loader = this.app.loader;
        for (const [name, url] of this.assets.entries()) {
            loader.add(name, url);
        }
        
        loader.load(this.awake.bind(this));
        this.resize();

        return this;
    }

    awake() {
        console.log(`[DEBUG] awake engine`);
        this.currentScene.awake();
        this.app.stage.addChild(this.currentScene);

        this.emit("awake");
        this.app.ticker.add((delta) => this.update(delta));
        console.log(`[DEBUG] awake engine done`);
    }

    update(delta = 0) {
        this.input.update(delta);
        this.currentScene.update(delta);

        this.emit("update", delta);
    }

    resize() {
        console.log(`[DEBUG] resize renderer triggered!`);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }
}