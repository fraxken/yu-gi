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

// export function addActor(entity) {
//     if (entity instanceof Actor) {
//         game.rootScene.appendActor(entity);
//         entity.triggerBehaviorEvent("awake");
//     }

//     return;
// }

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

/**
 * @param {!PIXI.Container | PIXI.Graphics} r1
 * @param {!PIXI.Container | PIXI.Graphics} r2
 * @returns {boolean}
 */
export function hitTestRectangle(r1, r2) {
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    const vx = Math.abs(r1.centerX - r2.centerX);
    const vy = Math.abs(r1.centerY - r2.centerY);

    //Figure out the combined half-widths and half-heights
    const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (vx < combinedHalfWidths) {
        // A collision might be occurring. Check for a collision on the y axis
        if (vy < combinedHalfHeights) {
            return  true;
        }
    }

    return false;
};
