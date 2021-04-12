import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../helpers";

class SimpleGreeting extends LitElement {
    static get properties() {
        return { name: { type: String } };
    }

    static get styles() {
        return css`
          p { color: #06F; }
          h2 { color: #06F; }
        `;
    }

    constructor() {
        super();

        bindToScriptEvent(this, "player.hp", "hp");
        bindToScriptEvent(this, "player.name", "name");
    }

    render() {
        return html`
            <div class="menu-player">
                <h2>${this.name}!</h2>
                <p>Player life: ${this.hp}!</p>
            </div>
        `;
    }
}

customElements.define("simple-greeting", SimpleGreeting);
