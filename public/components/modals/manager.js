import { LitElement, html, css } from "lit-element";

// STORE MODAL
import './store/index.js';

// RECUPERATOR DECK MODAL
import './recuperator-deck/index.js'

class ModalManager extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return css`
      .modal {
        pointer-events: all;
        font-family: "Helvetica";
        color: white;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 20px;
      }
    `
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