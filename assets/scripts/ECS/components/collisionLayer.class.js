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

        if ("chunks" in layer) {
            layer.chunks.forEach((chunk) => this.generate(chunk));
        }
        else if ("data" in layer) {
            this.generate(layer);
        }
    }

    generate(chunk, offset = null) {
        chunk.data = typeof chunk.data === "string" ? JSON.parse(chunk.data) : chunk.data;
        const xOffset = offset === null ? 0 : (offset.x / this.tileWidth);
        const yOffset = offset === null ? 0 : (offset.y / this.tileHeight);

        for (const { x, y, textureId } of TiledLayer.iter(chunk)) {
            if (textureId !== 0) {
                this.collisionsMap.add(`${x + xOffset}|${y + yOffset}`);
            }
        }
    }

    getNeighBourWalkable(x, y) {
        const posx = Math.floor(x / this.tileWidth);
        const posy = Math.floor(y / this.tileHeight);

        // Neighbours tile position in 4 directions
        const leftX = posx - 1;
        const rightX = posx + 1;
        const topY = posy - 1;
        const bottomY = posy;

        // Calcule dx/dy to avoid collision at factor 1?

        return {
            left: this.isRawWalkable(leftX, posy),
            right: this.isRawWalkable(rightX, posy),
            top: this.isRawWalkable(posx, topY),
            bottom: this.isRawWalkable(posx, bottomY)
        }
    }

    getTilePosition(x, y) {
        return {
            x: Math.floor(x / this.tileWidth),
            y: Math.floor(y / this.tileHeight)
        };
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
