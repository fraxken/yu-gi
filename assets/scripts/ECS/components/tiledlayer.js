// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import Internal dependencies
// import TiledSet from "./tiledset";
import TiledMap from "./tiledmap";

export default class TiledLayer extends PIXI.Container {
    /**
     * @param {!Tiled.TileLayer} layer
     * @param {!TiledMap} parent
     */
    constructor(layer, parent) {
        super();

        this.name = layer.name;
        this.parent = parent;
        this.alpha = layer.opacity;
        this.tiles = [];
        for (const chunk of layer.chunks) {
            chunk.data = JSON.parse(chunk.data);
        }

        this.setLayerTiles(layer);
    }

    /**
     *
     * @param {!Tiled.TileLayer} layer
     */
    setLayerTiles(layer) {
        const { width, height } = layer;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileIndex = x + (y * width);
                console.log({ x, y, tileIndex });

                // if (this.tileExists(layer, i)) {
                //     const tile = this.createTile(layer, { i, x, y });

                //     this.tiles.push(tile);
                //     this.addChild(tile);
                // }
            }
        }
    }

    /**
     * @param {!Tiled.TileLayer} layer
     */
    tileExists(layer, pos) {
        return layer.chunks.d[pos];
    }

    createTile(layer, tileData) {

    }
}
