import { LitElement, css, html } from "lit-element";

import { getActor } from "../../assets/scripts/ECS/helpers";
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
        const script = getActor("player").getScriptedBehavior("PlayerBehavior");

        bindToScriptEvent("hp", this, script);
    }

    render() {
        return html`<p>Player life: ${this.hp}!</p>`;
    }
}

customElements.define("simple-greeting", SimpleGreeting);
