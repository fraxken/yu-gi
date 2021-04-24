/**
 * ORIGINAL CODE CREATED BY Elisee MAURER for Superpowers
 * https://github.com/superpowers/superpowers-game/tree/master/SupEngine/src
 */

// Import dependencies
import * as PIXI from "pixi.js";

export default class Input extends PIXI.utils.EventEmitter {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        super();

        this.canvas = canvas;
        this.canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitPointerLockElement;
        document.addEventListener("pointerlockchange", this.onPointerLockChange.bind(this), false);
        document.addEventListener("mozpointerlockchange", this.onPointerLockChange.bind(this), false);
        document.addEventListener("webkitpointerlockchange", this.onPointerLockChange.bind(this), false);

        this.wantsPointerLock = false;
        this.wasPointerLocked = false;
        this.autoRepeatedKey = null;
        this.keyboardButtons = new Map();
        this.keyboardButtonsDown = new Set();
        this.gamepadsButtons = [];
        this.gamepadsAxes = [];
        this.gamepadsAutoRepeats = [];
        this.gamepadAxisDeadZone = 0.25;
        this.gamepadAxisAutoRepeatDelayMs = 500;
        this.gamepadAxisAutoRepeatRateMs = 33;

        document.addEventListener("keydown", this.onKeyDown.bind(this), true);
        document.addEventListener("keyup", this.onKeyUp.bind(this), true);

        // Gamepad
        for (let i = 0; i < 4; i++) {
            this.gamepadsButtons[i] = [];
            this.gamepadsAxes[i] = [];
            this.gamepadsAutoRepeats[i] = null;
        }
        this.resetGamepads();
    }

    destroy() {
        document.removeEventListener("keydown", this.onKeyDown, true);
        document.removeEventListener("keyup", this.onKeyUp, true);
    }

    lockMouse() {
        this.wantsPointerLock = true;
        this.canvas.requestPointerLock();
    }

    unlockMouse() {
        this.wantsPointerLock = false;
        this.wasPointerLocked = false;
        if (!this.isPointerLocked()) {
            return;
        }

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        document.exitPointerLock();
    }

    isPointerLocked() {
        return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
    }

    onPointerLockChange() {
        const isPointerLocked = this.isPointerLocked();
        if (this.wasPointerLocked !== isPointerLocked) {
            this.emit("mouseLockStateChange", isPointerLocked ? "active" : "suspended");
            this.wasPointerLocked = isPointerLocked;
        }
    }

    onPointerLockError() {
        if (this.wasPointerLocked) {
            this.emit("mouseLockStateChange", "suspended");
            this.wasPointerLocked = false;
        }
    }

    reset() {
        this.autoRepeatedKey = null;
        this.keyboardButtons.clear();
        this.keyboardButtonsDown.clear();

        // Gamepads
        this.resetGamepads();
    }

    resetGamepads() {
        for (let i = 0; i < 4; i++) {
            for (let button = 0; button < 16; button++) {
                this.gamepadsButtons[i][button] = {
                    isDown: false,
                    wasJustPressed: false,
                    wasJustReleased: false,
                    value: 0
                };
            }
            for (let axes = 0; axes < 4; axes++) {
                this.gamepadsAxes[i][axes] = {
                    wasPositiveJustPressed: false,
                    wasPositiveJustAutoRepeated: false,
                    wasPositiveJustReleased: false,
                    wasNegativeJustPressed: false,
                    wasNegativeJustAutoRepeated: false,
                    wasNegativeJustReleased: false,
                    value: 0
                };
            }
        }
    }

    key(code) {
        let button = this.keyboardButtons.get(code);
        if (!button) {
            button = {
                isDown: false,
                wasJustPressed: false,
                wasJustAutoRepeated: false,
                wasJustReleased: false
            };
            this.keyboardButtons.set(code, button);
        }

        return button;
    }

    _checkKeyboard(keyName, type = "isDown") {
        if (keyName === "ANY") {
            return [...this.keyboardButtons.values()].some((button) => button[type]);
        }

        return this.key(keyName);
    }

    isKeyDown(keyName) {
        const keyboardButton = this._checkKeyboard(keyName, "isDown");

        return keyboardButton.isDown;
    }

    isLeftStick(direction) {
        switch (direction) {
            case "LEFT":
                return this.gamepadsAxes[0][LEFT_STICK_X_AXIS].value < -this.gamepadAxisDeadZone;
            case "RIGHT":
                return this.gamepadsAxes[0][LEFT_STICK_X_AXIS].value > this.gamepadAxisDeadZone;
            case "UP":
                return this.gamepadsAxes[0][LEFT_STICK_Y_AXIS].value < -this.gamepadAxisDeadZone;
            case "DOWN":
                return this.gamepadsAxes[0][LEFT_STICK_Y_AXIS].value > this.gamepadAxisDeadZone;
            default:
                return false;
        }
    }

    isRightStick(direction) {
        switch (direction) {
            case "LEFT":
                return this.gamepadsAxes[0][RIGHT_STICK_X_AXIS].value < -this.gamepadAxisDeadZone;
            case "RIGHT":
                return this.gamepadsAxes[0][RIGHT_STICK_X_AXIS].value > this.gamepadAxisDeadZone;
            case "UP":
                return this.gamepadsAxes[0][RIGHT_STICK_Y_AXIS].value < -this.gamepadAxisDeadZone;
            case "DOWN":
                return this.gamepadsAxes[0][RIGHT_STICK_Y_AXIS].value > this.gamepadAxisDeadZone;
            default:
                return false;
        }
    }

    isGamepadButtonDown(buttonName) {
        const button = this.gamepadsButtons[0][buttonName];
        if (button) {
            return button.isDown;
        }

        return false;
    }

    wasGamepadButtonJustPressed(buttonName) {
        const button = this.gamepadsButtons[0][buttonName];
        if (button) {
            return button.wasJustPressed;
        }

        return false;
    }

    wasGamepadButtonJustReleased(buttonName) {
        const button = this.gamepadsButtons[0][buttonName];
        if (button) {
            return button.wasJustReleased;
        }

        return false;
    }

    wasKeyJustPressed(keyName, autoRepeat = false) {
        const keyboardButton = this._checkKeyboard(keyName, "wasJustPressed");

        return keyboardButton.wasJustPressed || (autoRepeat && keyboardButton.wasJustAutoRepeated);
    }

    wasKeyJustReleased(keyName) {
        const keyboardButton = this._checkKeyboard(keyName, "wasJustReleased");

        return keyboardButton.wasJustReleased;
    }

    onKeyDown(event) {
        const key = event.which || event.keyCode;

        // NOTE: Key codes in range 33-47 are Page Up/Down, Home/End, arrow keys, Insert/Delete, etc.
        const isControlKey = key < 48 && key !== 32;
        if (isControlKey) {
            event.preventDefault();
        }

        if (this.keyboardButtonsDown.has(key)) {
            this.autoRepeatedKey = key;
        }
        else {
            this.keyboardButtonsDown.add(key);
            const button = this.key(key);
            button.wasJustPressed = true;
            button.isDown = true;
        }

        return !isControlKey;
    }

    onKeyUp(event) {
        const key = event.which || event.keyCode;
        this.keyboardButtonsDown.delete(key);
    }

    update() {
        for (const [code, keyboardButton] of this.keyboardButtons) {
            const wasDown = keyboardButton.isDown;
            keyboardButton.isDown = this.keyboardButtonsDown.has(code);
            keyboardButton.wasJustAutoRepeated = false;
            keyboardButton.wasJustReleased = wasDown && !keyboardButton.isDown;

            if (keyboardButton.isDown) {
                this.emit("isDown", code);
            }
            if (keyboardButton.wasJustReleased) {
                this.emit("wasJustReleased", code);
            }
            if (keyboardButton.wasJustPressed) {
                this.emit("wasJustPressed", code);
            }
            keyboardButton.wasJustPressed = false;
        }

        if (this.autoRepeatedKey !== null) {
            this.key(this.autoRepeatedKey).wasJustAutoRepeated = true;
            this.autoRepeatedKey = null;
        }

        const gamepads = navigator.getGamepads === null ? null : navigator.getGamepads();
        if (gamepads === null) {
            return;
        }

        for (let index = 0; index < 4; index++) {
            const gamepad = gamepads[index];
            if (gamepad === null || gamepad === undefined) {
                continue;
            }

            for (let i = 0; i < this.gamepadsButtons[index].length; i++) {
                if (!Reflect.has(gamepad.buttons, i) || gamepad.buttons[i] === null) {
                    continue;
                }

                const button = this.gamepadsButtons[index][i];
                const wasDown = button.isDown;
                button.isDown = gamepad.buttons[i].pressed;
                button.value = gamepad.buttons[i].value;

                button.wasJustPressed = !wasDown && button.isDown;
                button.wasJustReleased = wasDown && !button.isDown;
            }

            const pressedValue = 0.5;
            const now = Date.now();

            for (let stick = 0; stick < 2; stick++) {
                if (gamepad.axes[2 * stick] === null || gamepad.axes[2 * stick + 1] === null) {
                    continue;
                }
                if (gamepad.axes[2 * stick] === undefined || gamepad.axes[2 * stick + 1] === undefined) {
                    continue;
                }

                const axisLength = Math.sqrt(
                    Math.pow(Math.abs(gamepad.axes[2 * stick]), 2) + Math.pow(Math.abs(gamepad.axes[2 * stick + 1]), 2)
                );

                const axes = [this.gamepadsAxes[index][2 * stick], this.gamepadsAxes[index][2 * stick + 1]];

                const wasAxisDown = [
                    { positive: axes[0].value > pressedValue, negative: axes[0].value < -pressedValue },
                    { positive: axes[1].value > pressedValue, negative: axes[1].value < -pressedValue }
                ];

                if (axisLength < this.gamepadAxisDeadZone) {
                    axes[0].value = 0;
                    axes[1].value = 0;
                }
                else {
                    axes[0].value = gamepad.axes[2 * stick];
                    axes[1].value = gamepad.axes[2 * stick + 1];
                }

                const isAxisDown = [
                    { positive: axes[0].value > pressedValue, negative: axes[0].value < -pressedValue },
                    { positive: axes[1].value > pressedValue, negative: axes[1].value < -pressedValue }
                ];

                axes[0].wasPositiveJustPressed = !wasAxisDown[0].positive && isAxisDown[0].positive;
                axes[0].wasPositiveJustReleased = wasAxisDown[0].positive && !isAxisDown[0].positive;
                axes[0].wasPositiveJustAutoRepeated = false;

                axes[0].wasNegativeJustPressed = !wasAxisDown[0].negative && isAxisDown[0].negative;
                axes[0].wasNegativeJustReleased = wasAxisDown[0].negative && !isAxisDown[0].negative;
                axes[0].wasNegativeJustAutoRepeated = false;

                axes[1].wasPositiveJustPressed = !wasAxisDown[1].positive && isAxisDown[1].positive;
                axes[1].wasPositiveJustReleased = wasAxisDown[1].positive && !isAxisDown[1].positive;
                axes[1].wasPositiveJustAutoRepeated = false;

                axes[1].wasNegativeJustPressed = !wasAxisDown[1].negative && isAxisDown[1].negative;
                axes[1].wasNegativeJustReleased = wasAxisDown[1].negative && !isAxisDown[1].negative;
                axes[1].wasNegativeJustAutoRepeated = false;

                let currentAutoRepeat = this.gamepadsAutoRepeats[index];
                if (currentAutoRepeat !== null && currentAutoRepeat !== undefined) {
                    const axisIndex = currentAutoRepeat.axis - stick * 2;
                    if (axisIndex === 0 || axisIndex === 1) {
                        const autoRepeatedAxis = axes[axisIndex];
                        if (
                            (currentAutoRepeat.positive && !isAxisDown[axisIndex].positive) ||
                            (!currentAutoRepeat.positive && !isAxisDown[axisIndex].negative)
                        ) {
                            // Auto-repeated axis has been released
                            currentAutoRepeat = null;
                            this.gamepadsAutoRepeats[index] = null;
                        }
                        else {
                            // Check for auto-repeat deadline
                            if (currentAutoRepeat.time <= now) {
                                if (currentAutoRepeat.positive) {
                                    autoRepeatedAxis.wasPositiveJustAutoRepeated = true;
                                }
                                else {
                                    autoRepeatedAxis.wasNegativeJustAutoRepeated = true;
                                }
                                currentAutoRepeat.time = now + this.gamepadAxisAutoRepeatRateMs;
                            }
                        }
                    }
                }

                let newAutoRepeat;
                if (axes[0].wasPositiveJustPressed || axes[0].wasNegativeJustPressed) {
                    newAutoRepeat = {
                        axis: stick * 2,
                        positive: axes[0].wasPositiveJustPressed,
                        time: now + this.gamepadAxisAutoRepeatDelayMs
                    };
                }
                else if (axes[1].wasPositiveJustPressed || axes[1].wasNegativeJustPressed) {
                    newAutoRepeat = {
                        axis: stick * 2 + 1,
                        positive: axes[1].wasPositiveJustPressed,
                        time: now + this.gamepadAxisAutoRepeatDelayMs
                    };
                }

                if (newAutoRepeat !== null && newAutoRepeat !== undefined) {
                    if (
                        currentAutoRepeat === null ||
                        currentAutoRepeat === undefined ||
                        currentAutoRepeat.axis !== newAutoRepeat.axis ||
                        currentAutoRepeat.positive !== newAutoRepeat.positive
                    ) {
                        this.gamepadsAutoRepeats[index] = newAutoRepeat;
                    }
                }
            }
        }
    }
}

export const StickDirection = Object.freeze({
    UP: { axe: 1, triggerValue: -0.25 },
    DOWN: { axe: 1, triggerValue: 0.25 },
    LEFT: { axe: 0, triggerValue: -0.25 },
    RIGHT: { axe: 0, triggerValue: 0.25 }
});

// XBOX One layout style
export const Button = Object.freeze({
    ANY: "ANY",
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LEFT_BUTTON: 4,
    RIGHT_BUTTON: 5,
    RIGHT_TRIGGER: 6,
    LEFT_TRIGGER: 7,
    SELECT: 8,
    START: 9,
    LEFT_STICK: 10,
    RIGHT_STICK: 11,
    ARROW_UP: 12,
    ARROW_DOWN: 13,
    ARROW_LEFT: 14,
    ARROW_RIGHT: 15
});

const LEFT_STICK_X_AXIS = 0;
const LEFT_STICK_Y_AXIS = 1;
const RIGHT_STICK_X_AXIS = 2;
const RIGHT_STICK_Y_AXIS = 3;

export const Key = Object.freeze({
    ANY: "ANY",
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    PAUSE: 19,
    CTRL: 17,
    ALT: 18,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINT_SCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    _0: 48,
    _1: 49,
    _2: 50,
    _3: 51,
    _4: 52,
    _5: 53,
    _6: 54,
    _7: 55,
    _8: 56,
    _9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    CMD: 91,
    CMD_RIGHT: 93,
    NUM_0: 96,
    NUM_1: 97,
    NUM_2: 98,
    NUM_3: 99,
    NUM_4: 100,
    NUM_5: 101,
    NUM_6: 102,
    NUM_7: 103,
    NUM_8: 104,
    NUM_9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMAL_POINT: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    SEMI_COLON: 186,
    EQUAL: 187,
    COMMA: 188,
    DASH: 189,
    PERIOD: 190,
    FORWARD_SLASH: 191,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    SINGLE_QUOTE: 222
});
