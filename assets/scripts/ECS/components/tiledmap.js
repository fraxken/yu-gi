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

        /** @type {Map<any, TiledSet>} */
        this.tiledSetMatcher = new Map();

        /** @type {Map<number, PIXI.Texture>} */
        this.textureIdCache = new Map();

        /** @type {Tiled.TileMap} */
        const data = findAsset(mapName).data;
        // TODO: handle tiled properties ?

        this.tileWidth = data.tilewidth;
        this.tileHeight = data.tileheight;
        this.tiledsets = data.tilesets.map((options) => new TiledSet(options));

        /** @type {TiledSet} */
        let lastTiledSet = null;

        for (const currentTiledSet of this.tiledsets) {
            if (lastTiledSet !== null) {
                this.setMatcher(lastTiledSet, currentTiledSet.firstgid);
            }
            lastTiledSet = currentTiledSet;
        }
        this.setMatcher(lastTiledSet, lastTiledSet.firstgid + lastTiledSet.tileCount);

        data.layers.filter((layer) => layer.type === "tilelayer").map((layer) => this.setTileLayer(layer));
        console.log(`[INFO] loaded TiledMap ${mapName}`);
        this.textureIdCache.clear();
    }

    setMatcher(lastTiledSet, currentgid) {
        const lastgid = lastTiledSet.firstgid;
        const matchPattern = (id) => id >= lastgid && id < currentgid;
        console.log(`[INFO] Loaded gid: >= ${lastgid} && < ${currentgid} for tiledsed '${lastTiledSet.name}'`);

        this.tiledSetMatcher.set(matchPattern, lastTiledSet);
    }

    /**
     * @param {!number} id
     * @returns {PIXI.Texture}
     */
    getTexture(id) {
        if (this.textureIdCache.has(id)) {
            return this.textureIdCache.get(id);
        }

        for (const [isMatching, tileSet] of this.tiledSetMatcher.entries()) {
            if (isMatching(id)) {
                const texture = tileSet.getTexture(id);
                this.textureIdCache.set(id, texture);

                return texture;
            }
        }

        return null;
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
