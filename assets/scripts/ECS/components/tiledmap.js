// Import third-party dependencies
import * as PIXI from "pixi.js";

// Import internal dependencies
import { findAsset, Actor } from "..";
import * as Component from "../component";

import TiledSet from "./tiledset";
import TiledLayer from "./tiledlayer";
import CollisionLayer from "./collisionLayer.class";

// CONSTANTS
const kCollisionLayerName = new Set(["collisions", "collision"]);

export default class TiledMap extends PIXI.Container {
    /** @type {CollisionLayer} */
    static sharedCollisionLayer = null;

    static assignProperties(object, properties = []) {
        object.tileProperties = Object.create(null);
        for (const property of properties) {
            object.tileProperties[property.name] = property.value;
        }
    }

    /**
     * @param {!string} mapName
     * @param {object} options
     * @param {boolean} [options.debug=false]
     * @param {boolean} [options.useSharedCollision=false]
     * @param {boolean} [options.showObjects=false]
     */
    constructor(mapName, options = {}) {
        super();
        Component.assignSymbols(this);
        this.name = mapName;
        this.debug = options.debug || false;
        this.showObjects = options.showObjects || false;
        this.useSharedCollision = options.useSharedCollision || false;
        this.collisionOffset = options.collisionOffset || null;

        /** @type {Map<string, TiledLayer>} */
        this.layers = new Map();

        /** @type {Map<string, Actor>} */
        this.objects = new Map();

        /** @type {Map<any, TiledSet>} */
        this.tiledSetMatcher = new Map();

        /** @type {Map<number, { gid: number; animated: boolean; texture: PIXI.Texture; frames: Tiled.AnimationFrame[]; }>} */
        this.textureIdCache = new Map();

        /** @type {Tiled.TileMap} */
        const data = findAsset(mapName).data;
        // TODO: handle tiled properties ?

        this.tileWidth = data.tilewidth;
        this.tileHeight = data.tileheight;

        data.tilesets
            .filter((config) => !TiledSet.loaded.has(config.name))
            .forEach((config) => new TiledSet(config, { debug: this.debug }));
        this.dataLayers = data.layers;

        /** @type {TiledSet} */
        let lastTiledSet = null;
        for (const currentTiledSet of TiledSet.cache) {
            if (lastTiledSet !== null) {
                this.setMatcher(lastTiledSet, currentTiledSet.firstgid);
            }
            lastTiledSet = currentTiledSet;
        }
        this.setMatcher(lastTiledSet, lastTiledSet.firstgid + lastTiledSet.tileCount);
    }

    init() {
        for (const layer of this.dataLayers) {
            switch(layer.type) {
                case "tilelayer":
                    this.setTileLayer(layer);
                    break;
                case "objectgroup":
                    this.setObjects(layer);
                    break;
            }
        }

        this.textureIdCache.clear();
        this.dataLayers = null;
        if (this.debug) {
            console.log(`[INFO] loaded TiledMap ${this.name}`);
        }
    }

    /**
     * @returns {CollisionLayer}
     */
    get collision() {
        return this.useSharedCollision ? TiledMap.sharedCollisionLayer : (this.layers.get("collision") || null);
    }

    setMatcher(lastTiledSet, currentgid) {
        const lastgid = lastTiledSet.firstgid;
        const matchPattern = (id) => id >= lastgid && id < currentgid;
        if (this.debug) {
            console.log(`[DEBUG] Loaded gid: >= ${lastgid} && < ${currentgid} for tiledsed '${lastTiledSet.name}'`);
        }

        this.tiledSetMatcher.set(matchPattern, lastTiledSet);
    }

    /**
     * @param {!number} id
     * @returns {{ gid: number; animated: boolean; texture: PIXI.Texture; frames: Tiled.AnimationFrame[]; }}
     */
    getTexture(id) {
        if (this.textureIdCache.has(id)) {
            return this.textureIdCache.get(id);
        }

        for (const [isMatching, tileSet] of this.tiledSetMatcher.entries()) {
            if (isMatching(id)) {
                const texture = tileSet.getTexture(id);
                this.textureIdCache.set(id, texture);

                return texture;
            }
        }

        return null;
    }

    /**
     * @param {!Tiled.TileObject} object
     * @returns {Actor}
     */
    drawObjectShape(object) {
        const { name, width, height, x, y } = object;

        const actor = new Actor(name);
        actor.width = width;
        actor.height = height;
        actor.position.set(x, y);

        // Note: doesn't really work!
        actor.rotation = object.rotation;
        TiledMap.assignProperties(actor, object.properties);

        if (this.showObjects) {
            const areaGraphic = new PIXI.Graphics().beginFill(0xffffff, 0.35);
            if (object.ellipse) {
                areaGraphic.drawEllipse(0, 0, width, height);
            }
            else {
                areaGraphic.drawRect(0, 0, width, height);
            }
            areaGraphic.interactive = true;

            const areaNameText = new PIXI.Text(name.toLowerCase(), {
                fill: "#12d94d",
                fontFamily: "Verdana",
                fontSize: 10,
                fontVariant: "small-caps",
                fontWeight: "bold",
                letterSpacing: 1,
                lineJoin: "round",
                strokeThickness: 2,
                align: "center"
            });
            areaNameText.anchor.set(0.5);

            // areaGraphic.on("mouseover", () => {
            //     console.log("in");
            //     areaGraphic.beginFill(0xffffff, 1);
            // });
            // areaGraphic.on("mouseout", () => {
            //     console.log("out");
            //     areaGraphic.beginFill(0xffffff, 0.35);
            // });
            areaGraphic.endFill();

            if (!object.ellipse) {
                areaNameText.position.set(areaGraphic.width / 2, areaGraphic.height / 2);
            }

            areaGraphic.addChild(areaNameText);
            actor.addChild(areaGraphic);
        }
        this.objects.set(actor.name, actor);
        this.emit("object", actor);

        return actor;
    }

    /**
     * @param {Tiled.TileLayer} layer
     */
    setObjects(layer) {
        const objects = layer.objects || [];

        for (const object of objects) {
            console.log(`[INFO] create object ${object.name}`);
            this.addChild(this.drawObjectShape(object));
        }
    }

    /**
     * @param {Tiled.TileLayer} layer
     */
    setTileLayer(layer) {
        if (kCollisionLayerName.has(layer.name.toLowerCase())) {
            layer.visible = true;

            /** @type {CollisionLayer} */
            let colLayer = null;
            if (this.useSharedCollision) {
                if (TiledMap.sharedCollisionLayer === null) {
                    colLayer = new CollisionLayer(layer, this);
                    TiledMap.sharedCollisionLayer = colLayer;
                }
                else {
                    colLayer = TiledMap.sharedCollisionLayer;

                    if ("chunks" in layer) {
                        layer.chunks.forEach((chunk) => colLayer.generate(chunk, this.collisionOffset));
                    }
                    else if ("data" in layer) {
                        colLayer.generate(layer, this.collisionOffset);
                    }
                }
            }
            else {
                colLayer = new CollisionLayer(layer, this);
            }
            this.layers.set("collision", colLayer);
        }
        else {
            const tileLayer = new TiledLayer(layer, this);

            this.layers.set(layer.name, tileLayer);
            this.addChild(tileLayer);
        }
    }
}
