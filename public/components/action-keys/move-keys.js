import { LitElement, css, html } from "lit-element";


class MoveKeys extends LitElement {
    static get properties() {
        return {
            upKey: { type: String },
            downKey: { type: String },
            leftKey: { type: String },
            rightKey: { type: String }
        };
    }

    static get styles() {
        return css`
        .move-keys-container {
            display: grid;
            position: relative;
            gap: 6px;
            margin-top: 34px;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(4, 1fr);
            grid-template-areas:
                ". . upLabel . ."
                ". . up . ."
                "leftLabel left down right rightLabel"
                ". . downLabel . .";
        }
        .up { grid-area: up; }
        .left { grid-area: left; }
        .down { grid-area: down; }
        .right {
            grid-area: right;
         }
        .upLabel {
            grid-area: upLabel;
            transform: translateY(-6px);
        }
        .leftLabel {
            grid-area: leftLabel;
            transform: translate(-24px , -6px);
        }
        .downLabel {
            grid-area: downLabel;
            transform: translateX(-16px);
        }
        .rightLabel {
            grid-area: rightLabel;
            transform: translateY(-6px);
        }
        .label {
            position: absolute;
            color: white;
            font-weight: bold;
            font-size: 16px;
            font-variant: small-caps;
            font-family: Roboto;
            text-shadow: 2px 2px 5px black;
         }
        `;
    }

    constructor() {
        super();
        this.upKey = '';
        this.downKey = '';
        this.leftKey = '';
        this.rightKey = '';
    }

    render() {
        return html`
            <div class="move-keys-container">
                <div class='up'>
                    <keyboard-icon key='${this.upKey}' ?isPress=${false}></keyboard-icon>
                </div>
                <div class='down'>
                    <keyboard-icon key='${this.downKey}' ?isPress=${false}></keyboard-icon>
                </div>
                <div class='left'>
                    <keyboard-icon key='${this.leftKey}' ?isPress=${false}></keyboard-icon>
                </div>
                <div class='right'>
                    <keyboard-icon key='${this.rightKey}' ?isPress=${false}></keyboard-icon>
                </div>
                <div class='upLabel label'>
                    <div>UP</div>
                </div>
                <div class='downLabel label'>
                    <div>DOWN</div>
                </div>
                <div class='leftLabel label'>
                    <div>LEFT</div>
                </div>
                <div class='rightLabel label'>
                    <div>RIGHT</div>
                </div>
            </div>
        `;
    }
}

customElements.define("move-keys", MoveKeys);
