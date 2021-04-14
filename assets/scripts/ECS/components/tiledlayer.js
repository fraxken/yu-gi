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
        this.startX = layer.startx;
        this.startY = layer.starty;
        this.visible = layer.visible;
        this.tiles = [];
        for (const chunk of layer.chunks) {
            chunk.data = JSON.parse(chunk.data);
        }

        this.setLayerTiles(layer);
        console.log(`[INFO] Loaded TiledLayer '${this.name}'`);
    }

    /**
     *
     * @param {!Tiled.TileLayer} layer
     */
    setLayerTiles(layer) {
        for (const chunk of layer.chunks) {
            const { width, height } = chunk;

            createChunk: for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const tileIndex = x + (y * width);
                    const textureId = chunk.data[tileIndex];
                    if (textureId === 0) {
                        continue;
                    }

                    const texture = this.parent.getTexture(textureId);
                    if (!texture) {
                        console.log("[ERROR] Texture not found: ", textureId, texture);
                        break createChunk;
                    }
                    // console.log(textureId, texture);

                    const newTile = new PIXI.Sprite(texture);
                    newTile.x = (chunk.x + x) * this.parent.tileWidth;
                    newTile.y = (chunk.y + y) * this.parent.tileHeight;

                    this.addTile(newTile);
                }
            }
        }
    }

    addTile(tile) {
        this.tiles.push(tile);
        this.addChild(tile);
    }

    createTile(layer, tileData) {
        // const { i, x, y } = tileData
        // const tileSet = findTileSet(layer.tiles[i].gid, this.parent.tiledsets)
        // const tile = new Tile(layer.tiles[i], tileSet, layer.horizontalFlips[i], layer.verticalFlips[i], layer.diagonalFlips[i])

        // tile.x = x * layer.tileWidth
        // tile.y = y * layer.tileHeight + (layer.map.tileHeight - tile.textures[0].height)

        // tile._x = x + (tileSet.tileOffset) ? tileSet.tileOffset.x : 0
        // tile._y = y + (tileSet.tileOffset) ? tileSet.tileOffset.y : 0

        // if (tile.textures.length > 1) {
        //     tile.animationSpeed = 1000 / 60 / tile.animations[0].duration
        //     tile.gotoAndPlay(0)
        // }
    }
}
