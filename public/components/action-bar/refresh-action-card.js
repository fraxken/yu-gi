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
            background: url("./images/icons/refresh.png") no-repeat;
            height: 84px;
            width: 84px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
          .action-button {
            position: absolute;
            bottom: 14px;
            right: 8px;
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
                <div class="action-button">
                    <keyboard-icon key='${this.key}' ?isPress=${false}></keyboard-icon>
                </div>
            </div>
        `;
    }
}

customElements.define("refresh-action-card", RefreshActionCard);
