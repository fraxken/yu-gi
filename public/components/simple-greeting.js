import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../helpers";

class SimpleGreeting extends LitElement {
    static get properties() {
        return { name: { type: String } };
    }

    static get styles() {
        return css`
          p { color: blue; }
        `;
    }

    constructor() {
        super();
        const script = game.getActor("player").getScriptedBehavior("PlayerBehavior");

        bindToScriptEvent("hp", this, script);
    }

    render() {
        return html`<p>Player life: ${this.hp}!</p>`;
    }
}

customElements.define("simple-greeting", SimpleGreeting);
