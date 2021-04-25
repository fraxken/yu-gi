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
            height: 60px;
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 60px 60px 0 60px;
            background: #FFFEF9;
            box-shadow: 1px 1px 8px 0 #7a7a7a;
            border: solid #FFFFFF 2px;
            position: relative;
        }
        .button {
            position:absolute;
            right: 0;
            bottom: 0;
        }
        `;
    }

    constructor() {
        super();
        this.key = '';
        this.typeAction = 'inventaire';
    }

    render() {
        return html`
            <div class="action-keys-container">
                <div>${this.typeAction}</div>
                <div class='button'>
                    <keyboard-icon key='${this.key}' ?isPress=${false}></keyboard-icon>
                </div>
            </div>
        `;
    }
}

customElements.define("action-key", ActionKey);
