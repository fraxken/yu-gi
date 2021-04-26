import { LitElement, css, html } from "lit-element";


class ActionKey extends LitElement {

    static get properties() {
        return {
            key: { type: String },
            typeAction: { type: String }
        };
    }

    static get styles() {
        return css`
        .action-keys-container {
            margin-top: 20px;
            height: 76px;
            width: 118px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .name{
            position: absolute;
            bottom: 19px;
            left: 2px;
            text-transform: uppercase;
            font-family: Roboto;
            text-shadow: 2px 2px 5px black;
            font-weight: bold;
            height: 23px;
            width: 62px;
            font-size: 15px;
            line-height: 23px;
            text-align: center;
            color: white;
        }
        .button {
            position:absolute;
            right: 8px;
            bottom: 18px;
        }
        .action {
            background: url('./images/icons/action.png') no-repeat;
        }
        .deck {
            background: url('./images/icons/deck.png') no-repeat;
        }
        `;
    }

    constructor() {
        super();
        this.key = '';
        this.typeAction = 'action';
    }

    render() {
        return html`
            <div class="action-keys-container ${this.typeAction}">
                <div class='name'>${this.typeAction}</div>
                <div class='button'>
                    <keyboard-icon key='${this.key}' ?isPress=${false}></keyboard-icon>
                </div>
            </div>
        `;
    }
}

customElements.define("action-key", ActionKey);
