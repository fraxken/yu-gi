// Import third-party dependencies
import * as PIXI from "pixi.js";

function center(gameObject, padding = { x: 0, y: 0 }) {
    const { width, height } = game.screenSize;

    gameObject.x = (width / 2) + (padding.x || 0);
    gameObject.y = (height / 2) + (padding.y || 0);
}

export default class AssetLoader extends PIXI.utils.EventEmitter {
    static createLoadingScreen() {
        const textStyle = {
            fontFamily: "Arial",
            fontSize: 34,
            fill: "#FFF",
            align: "center",
        };

        const container = new PIXI.Container();
        const loadingText = new PIXI.Text("Loading assets...", { ...textStyle, fontWeight: "bold" });
        const percentText = new PIXI.Text("0%", { ...textStyle, fontSize: 24 });

        loadingText.anchor.set(0.5, 0.5);
        percentText.anchor.set(0.5, 0.5);
        center(loadingText);
        center(percentText, { y: 50 });
        container.addChild(loadingText);
        container.addChild(percentText);

        return container;
    }

    constructor() {
        super();

        /** @type {Map<string, string>} */
        this.assets = new Map();
    }

    /**
     * @param {!string} name
     * @param {!string} assetURL
     */
    registerAsset(name, assetURL) {
        this.assets.set(name, assetURL);

        return this;
    }

    /**
     * @param {!PIXI.Loader} loader
     * @param {!Function} callback
     */
    loadAssets(loader, callback) {
        const loadingContainer = AssetLoader.createLoadingScreen();
        this.app.stage.addChild(loadingContainer);

        for (const [name, url] of this.assets.entries()) {
            loader.add(name, url);
        }

        const lazyCallback = () => setTimeout(() => {
            loadingContainer.destroy({ children: true });
            this.app.stage.removeChild(loadingContainer);
            callback();
        }, 200);

        loader.onLoad.add((loader, _) => {
            loadingContainer.children[1].text = `${loader.progress}%`;
        });
        loader.load(lazyCallback);
    }
}
