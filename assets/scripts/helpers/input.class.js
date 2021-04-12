// Import dependencies
import * as PIXI from "pixi.js";

export default class Input extends PIXI.utils.EventEmitter {
    constructor() {
        super();
        this.autoRepeatedKey = null;
        this.keyboardButtons = new Map();
        this.keyboardButtonsDown = new Set();

        document.addEventListener("keydown", this.onKeyDown.bind(this), true);
        document.addEventListener("keyup", this.onKeyUp.bind(this), true);
    }

    destroy() {
        document.removeEventListener("keydown", this.onKeyDown, true);
        document.removeEventListener("keyup", this.onKeyUp, true);
    }

    reset() {
        this.autoRepeatedKey = null;
        this.keyboardButtons.clear();
        this.keyboardButtonsDown.clear();
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
        }

        return !isControlKey;
    }

    onKeyUp(event) {
        const key = event.which || event.keyCode;

        this.keyboardButtonsDown.delete(key);
    }

    update() {
        for (const buttonDown of this.keyboardButtonsDown) {
            const button = this.key(buttonDown);
            button.isDown = true;
        }

        for (const [code, keyboardButton] of this.keyboardButtons) {
            const wasDown = keyboardButton.isDown;
            keyboardButton.isDown = this.keyboardButtonsDown.has(code);

            keyboardButton.wasJustPressed = !wasDown && keyboardButton.isDown;
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
        }

        if (this.autoRepeatedKey !== null) {
            this.key(this.autoRepeatedKey).wasJustAutoRepeated = true;
            this.autoRepeatedKey = null;
        }
    }
}

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
