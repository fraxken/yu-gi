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
        for (const chunk of layer.chunks) {
            const { width, height } = chunk;

            /** @type {number[]} */
            const data = chunk.data.reverse();

            for (let y = chunk.y; y < height; y++) {
                for (let x = chunk.x; x < width; x++) {
                    const textureId = data.pop();

                    // console.log({ x, y, textureId });
                    const texture = this.parent.getTexture(textureId);
                    // console.log(textureId, texture);

                    const newTile = new PIXI.Sprite(texture);
                    newTile.x = x * 16;
                    newTile.y = y * 16;
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
