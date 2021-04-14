// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset } from "../helpers";
import * as Component from "../component";

export default class TiledMap extends PIXI.Container {
    constructor(mapName) {
        super();
        Component.assignSymbols(this);
        console.log(`[DEBUG] Loading TiledMap ${mapName}`);

        this.layers = [];
        this.tiledsets = new Map();

        /** @type {Tiled.TileMap} */
        const data = findAsset(mapName).data;
        console.log(data);

        // TODO:
        // - Init TileSet
        // - Generate layer and tile
    }
}
