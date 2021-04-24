// Import internal Dependencies
import { Key } from "./helpers";
import { Button, StickDirection } from "./helpers/input.class";

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
    left: () => isDown("left") || game.input.isLeftStick("LEFT"),
    right: () => isDown("right") || game.input.isLeftStick("RIGHT"),
    up: () => isDown("top") || game.input.isLeftStick("UP"),
    down: () => isDown("bottom") || game.input.isLeftStick("DOWN"),
    use() {
        return Keys.use.some((key) => game.input.wasKeyJustPressed(key) || game.input.wasGamepadButtonJustPressed(Button.A));
    }
}
