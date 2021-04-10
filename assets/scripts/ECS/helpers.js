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
    return game.currentScene.findActor(name, true);
}

/**
 * @returns {State}
 */
export function getCurrentState() {
    return game.state;
}

// const getOneTexture = (url) => app.loader.resources[url].texture;

/**
 * @param {!string} assetName 
 * @returns {PIXI.Spritesheet}
 */
export function getSpritesheet(assetName) {
    return game.app.loader.resources[assetName].spritesheet;
}

/**
 * @param {!string} assetName 
 * @param {!string} name 
 * @returns {PIXI.Texture}
 */
export function getAtlasTexture(assetName, name) {
    return game.app.loader.resources[assetName].textures[name];
}
