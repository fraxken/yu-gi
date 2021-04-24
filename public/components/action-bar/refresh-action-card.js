import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../../helpers";

class RefreshActionCard extends LitElement {
    static get properties() {
        return {
          key: { type: String }
        };
    }


    static get styles() {
        return css`
          .action-card-container {
            background-color: white;
            height: 80px;
            width: 80px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
        `;
    }

    constructor() {
        super();
        this.key = '';
    }

    render() {
        return html`
            <div class="action-card-container">
            Refresh
            <action-button key="${this.key}"></action-button>
            </div>
        `;
    }
}

customElements.define("refresh-action-card", RefreshActionCard);
