// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset } from "../helpers";

export default class TiledSet {
    /**
     * @param {!Tiled.TileSet} options
     */
    constructor(options) {
        this.name = options.name;
        this.firstgid = options.firstgid;
        this.textures = [];

        /** @type {Tiled.TileSet} */
        const data = findAsset(`${this.name}_json`).data;
        this.baseTexture = new PIXI.BaseTexture(findAsset(`${this.name}_texture`), {

        });
        console.log(this.baseTexture);

        this.tileWidth = data.tilewidth;
        this.tileHeight = data.tileheight;

        const { margin, image } = data;
        for (let y = margin; y < image.height; y += this.tileHeight) {
            for (let x = margin; x < image.width; x += this.tileWidth) {
                const tileRectangle = new PIXI.Rectangle(x, y, this.tileWidth, this.tileHeight);
                this.textures.push(new PIXI.Texture(this.baseTexture, tileRectangle));
            }
        }
        console.log(`[INFO] Loaded TiledSet name '${this.name}'`)
    }
}
