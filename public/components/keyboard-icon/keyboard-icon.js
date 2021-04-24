import { LitElement, css, html } from "lit-element";
import { styleMap } from 'lit-html/directives/style-map';
import { KeysPosition, PIXEL_GAP } from './keys-position.js';


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
                background: url("../controllers-icon/keyboard.png");
                transform: scale(1.8);
            }
        `;
    }

    constructor() {
        super();
        this.key = "A";
        this.isPress = false;
    }

    render() {
        const { x, y, h, w } = KeysPosition[this.key];
        const isPressButton = this.isPress && !['MOUSE', 'MOUSE_RIGHT_CLICK', 'MOUSE_LEFT_CLICK', 'MOUSE_FULL_CLICK'].includes(this.key);


        return html`
            <div style=${styleMap({
            height: `${h}px`,
            width: `${w}px`,
            backgroundPosition: `${x}px ${y + (isPressButton ? PIXEL_GAP : 0)}px`
        })}>
            </div>
        `;
    }
}

customElements.define("keyboard-icon", KeyboardIcon);
