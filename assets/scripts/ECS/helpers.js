import * as PIXI from "pixi.js";
import Actor from "./actor.class";

/**
 * 
 * @param {!string} name 
 * @returns {Actor | null}
 */
export function getActor(name) {
    return game.currentScene.findActor(name, true);
}

// const getOneTexture = (url) => app.loader.resources[url].texture;

/**
 * 
 * @param {!string} assetName 
 * @param {!string} name 
 * @returns {PIXI.Texture}
 */
export function getAtlasTexture(assetName, name) {
    return game.app.loader.resources[assetName].textures[name];
}
