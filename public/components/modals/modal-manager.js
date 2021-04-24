import { LitElement, html, css } from "lit-element";

class ModalManager extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return css`
      .modal {
        pointer-events: all;
        font-family: "Helvetica";
        background-color: rgba(0, 0, 0, 0.3);
        padding: 20px;
        position: absolute;
        height: 80%; 
        width: 80%; 
        top: 10%; 
        left: 10%; 
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