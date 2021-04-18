import * as PIXI from "pixi.js";

import TiledMap from "./tiledmap";
import TiledLayer from "./tiledlayer";

export default class CollisionLayer extends PIXI.Container {
    /**
     * @param {Tiled.TileLayer} layer
     * @param {TiledMap} parent
     */
    constructor(layer, parent) {
        super();
        this.width = layer.width;
        this.height = layer.height;
        this.tileWidth = parent.tileWidth;
        this.tileHeight = parent.tileHeight;
        this.collisionsMap = new Set();

        for (const chunk of layer.chunks) {
            chunk.data = JSON.parse(chunk.data);

            for (const { x, y, textureId } of TiledLayer.iter(chunk)) {
                if (textureId !== 0) {
                    this.collisionsMap.add(`${x}|${y}`);
                }
            }
        }
    }

    getNeighBourWalkable(x, y) {
        const posx = Math.floor(x / this.tileWidth);
        const posy = Math.floor(y / this.tileHeight);

        // Neighbours tile position in 4 directions
        const leftX = posx - 1;
        const rightX = posx + 1;
        const topY = posy;
        const bottomY = posy + 1;

        // Calcule dx/dy to avoid collision at factor 1?

        return {
            left: this.isRawWalkable(leftX, posy),
            right: this.isRawWalkable(rightX, posy),
            top: this.isRawWalkable(posx, topY),
            bottom: this.isRawWalkable(posx, bottomY)
        }
    }

    /**
     * @param {!number} x
     * @param {!number} y
     */
    isRawWalkable(x, y) {
        return this.collisionsMap.has(`${x}|${y}`);
    }

    /**
     *
     * @param {!number} x
     * @param {!number} y
     */
    isWalkable(x, y) {
        const posx = Math.floor(x / this.tileWidth);
        const posy = Math.floor(y / this.tileHeight);

        return this.collisionsMap.has(`${posx}|${posy}`);
    }
}
