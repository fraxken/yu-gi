// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import Internal dependencies
// import TiledSet from "./tiledset";
import TiledMap from "./tiledmap";

export default class TiledLayer extends PIXI.Container {
    /**
     * @param {!Tiled.TileChunk} chunk
     */
    static *iter(chunk) {
        const { width, height } = chunk;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileIndex = x + (y * width);

                /** @type {number} */
                const textureId = chunk.data[tileIndex];

                yield { x: chunk.x + x, y: chunk.y + y, textureId };
            }
        }
    }

    /**
     * @param {!Tiled.TileLayer} layer
     * @param {!TiledMap} parent
     */
    constructor(layer, parent) {
        super();
        const { name, opacity, visible } = layer;
        Object.assign(this, { name, opacity, visible });
        this.parent = parent;
        this.tiles = [];

        TiledMap.assignProperties(this, layer.properties);
        if ("chunks" in layer) {
            layer.chunks.forEach((chunk) => this.generate(chunk));
        }
        else if ("data" in layer) {
            this.generate(layer);
        }

        if (this.parent.debug) {
            console.log(`[INFO] Loaded TiledLayer '${this.name}'`);
        }
    }

    /**
     * @param {!Tiled.TileChunk | Tiled.TileLayer} chunk
     */
    generate(chunk) {
        chunk.data = typeof chunk.data === "string" ? JSON.parse(chunk.data) : chunk.data;

        for (const { x, y, textureId } of TiledLayer.iter(chunk)) {
            if (textureId === 0) {
                continue;
            }
            const tile = this.createTile(x, y, textureId);

            this.tiles.push(tile);
            this.addChild(tile);
        }
    }

    /**
     * @param {!number} x
     * @param {!number} y
     * @param {!number} textureId
     */
    createTile(x, y, textureId) {
        const texture = this.parent.getTexture(textureId);

        const tile = new PIXI.Sprite(texture);
        tile.x = x * this.parent.tileWidth;
        tile.y = y * this.parent.tileHeight;

        return tile;
    }
}
