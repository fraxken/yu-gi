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
            height: 50px;
            width: 50px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .action-button {
            position: absolute;
            transform: translate(16px , 20px);
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
                <div>Refresh</div>
                <div class="action-button">
                    <keyboard-icon key='${this.key}' ?isPress=${false}></keyboard-icon>
                </div>
            </div>
        `;
    }
}

customElements.define("refresh-action-card", RefreshActionCard);
