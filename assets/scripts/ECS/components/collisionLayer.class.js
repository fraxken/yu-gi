import TiledMap from "./tiledmap";
import TiledLayer from "./tiledlayer";

export default class CollisionLayer {
    /**
     * @param {Tiled.TileLayer} layer
     * @param {TiledMap} parent
     */
    constructor(layer, parent) {
        this.width = layer.width;
        this.height = layer.height;
        this.tileWidth = parent.tileWidth;
        this.tileHeight = parent.tileHeight;
        this.collisionsMap = [];

        for (const chunk of layer.chunks) {
            chunk.data = JSON.parse(chunk.data);

            for (const { x, y, textureId } of TiledLayer.iter(chunk)) {
                this.collisionsMap.push(textureId !== 0);
            }
        }

        console.log(this.collisionsMap);
    }

    /**
     *
     * @param {!number} x
     * @param {!number} y
     */
    isWalkable(x, y) {
        const posx = Math.floor(x / this.tileWidth);
        const posy = Math.floor(y / this.tileHeight);

        return this.collisionsMap[posx + posy * this.width];
    }

    // *getCollidables() {
    //     for (let i = 0; i < this.tilesMap.length; ++i) {
    //         if (typeof this.tilesMap[i] !== "undefined") {
    //             const column = i % this.width;
    //             const row = Math.floor(i / this.width);

    //             yield {
    //                 x: column * this.tileWidth,
    //                 y: row * this.tileHeight,
    //                 width: this.tileWidth,
    //                 height: this.tileHeight
    //             }
    //         }
    //     }
    // }
}
