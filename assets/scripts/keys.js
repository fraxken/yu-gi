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
    jump: [
        { code: Key.SPACE, type: null },
        { code: Button.B, type: Type.Gamepad, button: true }
    ],
    dash: [
        { code: Key.C, type: null },
        { code: Button.X, type: Type.Gamepad, button: true }
    ],
    use: [
        { code: Key.E, type: null },
        { code: Button.A, type: Type.Gamepad, button: true }
    ],
    cardAttack: [
        { code: Key._1, type: Type.KeyboardL },
        { code: Key.NUM_1, type: Type.KeyboardR }
    ],
    cardDefense: [
        { code: Key._2, type: Type.KeyboardL },
        { code: Key.NUM_2, type: Type.KeyboardR }
    ],
    cardConsumable: [
        { code: Key._3, type: Type.KeyboardL },
        { code: Key.NUM_3, type: Type.KeyboardR }
    ],
    cardRefresh: [
        { code: Key.X, type: Type.KeyboardL },
        { code: Key.ENTER, type: Type.KeyboardR }
    ],
    escape: [
        { code: Key.ESCAPE, type: null },
    ]
}

export const Metrics = {
    type: Type.KeyboardL
}

// isKeyDown -> la touche est maintenu enfoncé.
// wasKeyJustPressed -> la touche clavier est pressé (déclenché une fois).
// wasKeyJustReleased -> la touche clavier est remonté (déclenché une fois).

function someKey(keyName, action, actionPad = "isLeftStick") {
    const hasSome = Keys[keyName].some((key) => {
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
    if (hasSome) {
        window.hudevents.emit("input_action", keyName, action);
    }

    return hasSome;
}

export const Inputs = {
    left: () => someKey("left", "isKeyDown"),
    right: () => someKey("right", "isKeyDown"),
    up: () => someKey("top", "isKeyDown"),
    down: () => someKey("bottom", "isKeyDown"),
    jump: () => someKey("jump", "wasKeyJustPressed"),
    dash: () => someKey("dash", "wasKeyJustPressed"),
    escape: () => someKey("escape", "wasKeyJustPressed"),
    offensive: () => someKey("cardAttack", "wasKeyJustPressed"),
    defensive: () => someKey("cardDefense", "wasKeyJustPressed"),
    consumable: () => someKey("cardConsumable", "wasKeyJustPressed"),
    refresh: () => someKey("cardRefresh", "wasKeyJustPressed"),
    use: () => someKey("use", "wasKeyJustPressed"),
}
