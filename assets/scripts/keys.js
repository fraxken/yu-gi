// Import internal Dependencies
import { Key } from "./helpers";

export const Keys = {
    left: [Key.Q, Key.LEFT],
    right: [Key.D, Key.RIGHT],
    top: [Key.Z, Key.UP],
    bottom: [Key.S, Key.DOWN],
    use: [Key.E, Key.SPACE]
}

// isKeyDown -> la touche est maintenu enfoncé.
// wasKeyJustPressed -> la touche clavier est pressé (déclenché une fois).
// wasKeyJustReleased -> la touche clavier est remonté (déclenché une fois).

/**
 * @param {!string} keyName
 * @returns {boolean}
 */
function isDown(keyName) {
    return Keys[keyName].some((key) => game.input.isKeyDown(key));
}

export const Inputs = {
    left: () => isDown("left"),
    right: () => isDown("right"),
    up: () => isDown("top"),
    down: () => isDown("bottom"),
    use() {
        return Keys.use.some((key) => game.input.wasKeyJustPressed(key));
    }
}
