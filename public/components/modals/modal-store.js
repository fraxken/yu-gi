import { LitElement, html, css } from 'lit-element';

class StoreModal extends LitElement {
  static get styles() {
    return css`
      .modal-store {
        height: 80%;
      }
      .modal-store-title { 
        color: white;
      }
      .modal-store-column-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
      }
      .modal-store-column{
        margin: 20px;
        flex-basis: 100%;
        height: 100%;
      }
      .main-list {
        height: 80%;
        overflow-y: scroll;
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }

  constructor() {
    super();
    this.selectedItemIndex = 0;
    this.items = products;
  }

  render() {
    return html`
      <div class="modal-store">
        <h1 class="modal-store-title">Store</h1>
        <div class="modal-store-column-wrapper">
          <div class="modal-store-column product-list">
          <div class="main-list">
            List of cards (${this.items.length})
            <ul>
              ${this.items.map((item) => html`<li @click=${() => this.handleSelectItem(item.id)}>${item.name}</li>`)}
            </ul>
          </div>
          </div>
          <div class="modal-store-column product-detail">
            <div>
              ${this.selectedItemIndex !== undefined || this.selectedItemIndex !== null
                ? this.renderProductDetail(this.selectedItemIndex)
                : this.fallBackRender()
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  handleSelectItem(id) {
    const newIndex = this.items.findIndex(item => item.id === id)
    this.selectedItemIndex = newIndex
  }
  
  fallBackRender() {
    return html`Please select a product.`;
  }

  renderProductDetail(index) {
    const { name } = this.items[index];

    return html`
      <div>
        <h2>Detail of ${name}</h2>
      </div>
    `;
  }
  
}

customElements.define('modal-store', StoreModal);

/**
 * STATIC DATA -> MOVE THEME ELSEWHERE
 */

const products = [
  {
    id: 1,
    name: "Potion",
    description: "Awesome potion, take it.",
    gains: { property1: "Gain 1", property2: "Gain 2", property3: "Gain 3"}
  },
  {
    id: 2,
    name: "Sword",
    description: "Awesome Sword, take it.",
    gains: { property1: "Gain 1", property2: "Gain 2", property3: "Gain 3"}
  },
  {
    id: 3,
    name: "Shield",
    description: "Awesome Shield, take it.",
    gains: { property1: "Gain 1", property2: "Gain 2", property3: "Gain 3"}
  }
];