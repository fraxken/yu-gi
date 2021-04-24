import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../../helpers";

class ActionButton extends LitElement {
    static get properties() {
        return { 
          key: { type: String }};
    }

    static get styles() {
        return css`
          .action-button {
            position: absolute;
            height: 40px;
            width: 40px;
            background-color: white;
            bottom: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translate(4px , 4px);
            border-radius: 2px;
            border: 1px solid grey;
          }
        `;
    }

    constructor() {
        super();
        this.key = '';

    }

    render() {
        return html`
            <div class="action-button">${this.key}</div>
        `;
    }
}

customElements.define("action-button", ActionButton);
