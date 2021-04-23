// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset } from "../helpers";

export default class TiledSet {
    /** @type {TiledSet[]} */
    static cache = [];
    /** @type {Set<string>} */
    static loaded = new Set();

    /**
     * @param {!Tiled.TileSet} tiledData
     */
    constructor(tiledData, options = {}) {
        TiledSet.loaded.add(tiledData.name);
        this.name = tiledData.name;
        this.firstgid = tiledData.firstgid;
        this.debug = options.debug;
        this.textures = [];

        /** @type {Tiled.TileSet} */
        const data = findAsset(`${this.name}_json`).data;

        const resource = findAsset(`${this.name}_texture`);
        this.baseTexture = resource.texture.baseTexture;
        this.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.tileWidth = data.tilewidth;
        this.tileHeight = data.tileheight;
        this.tileCount = data.tilecount;

        /** @type {Map<number, Tiled.AnimationFrame[]>} */
        this.animatedTile = new Map();
        if (data.tile) {
            const tiles = Array.isArray(data.tile) ? data.tile : [data.tile];
            tiles.forEach((tile) => this.addAnimatedTile(tile));
        }

        const { margin, image } = data;
        for (let y = margin; y < image.height; y += this.tileHeight) {
            for (let x = margin; x < image.width; x += this.tileWidth) {
                const tileRectangle = new PIXI.Rectangle(x, y, this.tileWidth, this.tileHeight);
                const texture = new PIXI.Texture(this.baseTexture, tileRectangle);

                this.textures.push(texture);
            }
        }
        if (this.debug) {
            console.log(`[INFO] Loaded TiledSet name '${this.name}' with '${this.textures.length}' textures!`);
        }
        TiledSet.cache.push(this);
    }

    /**
     * @param {!Tiled.Tile} tile
     */
    addAnimatedTile(tile) {
        if (!tile.animation) {
            return;
        }

        this.animatedTile.set(tile.id, tile.animation.frame);
    }

    /**
     * @param {!number} id
     */
    getTexture(id) {
        const realId = id - this.firstgid;
        const animated = this.animatedTile.has(realId);

        return {
            gid: this.firstgid,
            animated,
            texture: this.textures[realId],
            frames: animated ? this.animatedTile.get(realId) : null
        };
    }
}
