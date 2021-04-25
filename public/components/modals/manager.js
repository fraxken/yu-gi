import { LitElement, html, css } from "lit-element";

// MODALS
import './store/index';
import './minimap/index';
import './recuperator-deck/index'

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
