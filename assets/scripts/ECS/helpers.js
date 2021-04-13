// import { game } from "../../../global";
import * as PIXI from "pixi.js";
import Actor from "./actor.class";
import State from "./state.class";

/**
 *
 * @param {!string} name
 * @returns {Actor | null}
 */
export function getActor(name) {
    return game.rootScene.findChild(name, true);
}

/**
 * @param {!string} assetName
 * @returns {PIXI.ILoaderResource}
 */
export function findAsset(assetName) {
    return game.app.loader.resources[assetName];
}

/**
 * @returns {State}
 */
export function getCurrentState() {
    return game.state;
}

/**
 * @param {!string} assetName
 * @param {!string} textureName
 * @returns {PIXI.Texture}
 */
export function getTexture(assetName, textureName) {
    return findAsset(assetName).textures[textureName];
}
