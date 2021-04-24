import { LitElement, html } from "lit-element";

class ModalManager extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="modal">
        <slot name="modal"></slot>
      </div>
    `;
  }
}

customElements.define("modal-manager", ModalManager);