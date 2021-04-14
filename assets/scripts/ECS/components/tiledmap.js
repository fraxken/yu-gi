// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset } from "../helpers";
import * as Component from "../component";

import TiledSet from "./tiledset";
import TiledLayer from "./tiledlayer";

export default class TiledMap extends PIXI.Container {
    constructor(mapName) {
        super();
        Component.assignSymbols(this);

        /** @type {Map<string, TiledLayer>} */
        this.layers = new Map();

        /** @type {Tiled.TileMap} */
        const data = findAsset(mapName).data;
        // TODO: handle tiled properties ?

        this.tiledsets = data.tilesets.forEach((options) => new TiledSet(options));

        data.layers.filter((layer) => layer.type === "tilelayer").map((layer) => this.setTileLayer(layer));
        console.log(`[INFO] loaded TiledMap ${mapName}`);
    }

    /**
     * @param {Tiled.TileLayer} layer
     */
    setTileLayer(layer) {
        if (layer.name === "Collisions") {
            // TODO: handle collisions here
        }

        const tileLayer = new TiledLayer(layer, this);
        this.layers.set(layer.name, tileLayer);
        this.addChild(tileLayer);
    }
}
