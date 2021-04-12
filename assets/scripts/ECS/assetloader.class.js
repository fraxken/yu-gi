// Import third-party dependencies
import * as PIXI from "pixi.js";

export default class AssetLoader extends PIXI.utils.EventEmitter {
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
        for (const [name, url] of this.assets.entries()) {
            loader.add(name, url);
        }
        loader.load(callback);
    }
}
