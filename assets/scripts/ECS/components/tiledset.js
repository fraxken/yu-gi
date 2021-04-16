// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset } from "../helpers";

export default class TiledSet {
    /**
     * @param {!Tiled.TileSet} tiledData
     */
    constructor(tiledData, options = {}) {
        this.name = tiledData.name;
        this.firstgid = tiledData.firstgid;
        this.debug = options.debug;
        this.textures = [];

        /** @type {Tiled.TileSet} */
        const data = findAsset(`${this.name}_json`).data;

        const resource = findAsset(`${this.name}_texture`);
        this.baseTexture = resource.texture.baseTexture;

        this.tileWidth = data.tilewidth;
        this.tileHeight = data.tileheight;
        this.tileCount = data.tilecount;

        const { margin, image } = data;
        for (let y = margin; y < image.height; y += this.tileHeight) {
            for (let x = margin; x < image.width; x += this.tileWidth) {
                const tileRectangle = new PIXI.Rectangle(x, y, this.tileWidth, this.tileHeight);
                this.textures.push(new PIXI.Texture(this.baseTexture, tileRectangle));
            }
        }
        if (this.debug) {
            console.log(`[INFO] Loaded TiledSet name '${this.name}' with '${this.textures.length}' textures!`);
        }
    }

    /**
     * @param {!number} id
     */
    getTexture(id) {
        const realId = id - this.firstgid;

        return this.textures[realId];
    }
}
