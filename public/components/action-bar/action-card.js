import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../../helpers";

class ActionCard extends LitElement {
    static get properties() {
        return { 
          card: { type: Object },
          key: { type: String }
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
            ${this.card.typeCard}
            <action-button key="${this.card.key}"></action-button>
            </div>
        `;
    }
}

customElements.define("action-card", ActionCard);
