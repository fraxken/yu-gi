import { LitElement, html } from 'lit-element';

class StoreModal extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <h1>Ceci n'est pas un store !</h1>
    `;
  }
}

customElements.define('modal-store', StoreModal);