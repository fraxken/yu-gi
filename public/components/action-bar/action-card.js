import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../../helpers";

class ActionCard extends LitElement {
    static get properties() {
        return {
            card: { type: Object }
        };
    }

    static get styles() {
        return css`
          .action-card-container {
            background-color: white;
            height: 100%;
            width: 100%;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            color: black;
            min-height: 100px;
            min-width: 80px;
          }
          .action-button {
            position: absolute;
            transform: translate(36px , 46px);
          }
        `;
    }

    constructor() {
        super();
        this.card = {};
    }

    render() {
        return html`
            <div class="action-card-container">
                <div>${this.card.typeCard}</div>
                <div class="action-button">
                    <keyboard-icon key='${this.card.key}' ?isPress=${false}></keyboard-icon>
                </div>
            </div>
        `;
    }
}

customElements.define("action-card", ActionCard);
