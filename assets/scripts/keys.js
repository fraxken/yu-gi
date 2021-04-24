// Import internal Dependencies
import { Key } from "./helpers";
import { Button, StickDirection } from "./helpers/input.class";

export const Type = {
    KeyboardL: "KeyboardL",
    KeyboardR: "KeyboardR",
    Gamepad: "Gamepad"
}

export const Keys = {
    left: [
        { code: Key.Q, type: Type.KeyboardL },
        { code: Key.LEFT, type: Type.KeyboardR },
        { code: "LEFT", type: Type.Gamepad, button: false }
    ],
    right: [
        { code: Key.D, type: Type.KeyboardL },
        { code: Key.RIGHT, type: Type.KeyboardR },
        { code: "RIGHT", type: Type.Gamepad, button: false }
    ],
    top: [
        { code: Key.Z, type: Type.KeyboardL },
        { code: Key.UP, type: Type.KeyboardR },
        { code: "UP", type: Type.Gamepad, button: false }
    ],
    bottom: [
        { code: Key.S, type: Type.KeyboardL },
        { code: Key.DOWN, type: Type.KeyboardR },
        { code: "DOWN", type: Type.Gamepad, button: false }
    ],
    use: [
        { code: Key.E, type: null },
        { code: Key.SPACE, type: null },
        { code: Button.A, type: Type.Gamepad, button: true }
    ]
}

export const Metrics = {
    type: Type.KeyboardL
}

// isKeyDown -> la touche est maintenu enfoncé.
// wasKeyJustPressed -> la touche clavier est pressé (déclenché une fois).
// wasKeyJustReleased -> la touche clavier est remonté (déclenché une fois).

function someKey(keyName, action, actionPad = "isLeftStick") {
    return Keys[keyName].some((key) => {
        let result;
        if (key.type === Type.Gamepad) {
            result = game.input[key.button ? "wasGamepadButtonJustPressed" : actionPad](key.code);
        }
        else {
            result = game.input[action](key.code);
        }

        if (result && key.type !== null && Metrics.type !== key.type) {
            Metrics.type = key.type;
            window.hudevents.emit("input_type", Metrics.type);
        }

        return result;
    });
}

export const Inputs = {
    left: () => someKey("left", "isKeyDown"),
    right: () => someKey("right", "isKeyDown"),
    up: () => someKey("top", "isKeyDown"),
    down: () => someKey("bottom", "isKeyDown"),
    use: () => someKey("use", "wasKeyJustPressed"),
}
