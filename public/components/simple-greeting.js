import { LitElement, css, html } from "lit-element";

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
        this.name = "World";
    }

    render() {
        return html`<p>Hello, ${this.name}!</p>`;
    }
}

customElements.define("simple-greeting", SimpleGreeting);
