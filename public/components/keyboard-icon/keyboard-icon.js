import { LitElement, css, html } from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { KeysPosition, PIXEL_GAP, PIXEL_SCALE, PIXEL_SCALE_MOUSE } from './keys-position.js';


class KeyboardIcon extends LitElement {
    static get properties() {
        return {
            key: { type: String },
            isPress: { type: Boolean }
        };
    }

    static get styles() {
        console.log(KeysPosition[this.key]);
        return css`
            div {
                background: url("../images/keyboard.png");
            }
        `;
    }

    constructor() {
        super();
        this.key = "";
        this.isPress = false;
    }

    render() {
        if (!KeysPosition[this.key]) {
            return null;
        }

        const { x, y, h, w } = KeysPosition[this.key];
        const isMouseKey = ['MOUSE', 'MOUSE_RIGHT_CLICK', 'MOUSE_LEFT_CLICK', 'MOUSE_FULL_CLICK'].includes(this.key);
        const isPressButton = this.isPress && !isMouseKey;

        return html`
            <div style=${styleMap({
            height: `${h}px`,
            width: `${w}px`,
            backgroundPosition: `${x}px ${y + (isPressButton ? PIXEL_GAP : 0)}px`,
            transform: `scale(${(isMouseKey ? PIXEL_SCALE_MOUSE : PIXEL_SCALE)})`
        })}>
            </div>
        `;
    }
}

customElements.define("keyboard-icon", KeyboardIcon);
