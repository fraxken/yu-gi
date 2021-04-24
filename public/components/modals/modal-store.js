import { LitElement, html, css } from 'lit-element';

class StoreModal extends LitElement {
  static get properties() {
    return {
      selectedItemIndex: { type: Number },
      items: { type: Array }
    }
  }

  static get styles() {
    return css`
      /* .modal-store {
        height: calc(100vh - 200px);
      } */
      .modal-store-title { 
        color: white;
      }
      .main-list {
        height: 100%;
        overflow-y: scroll;
        background-color: rgba(255, 255, 255, 0.3);
      }
      .modal-store-column-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: calc(100vh - 200px);
        gap: 0px 8px;
      }
    `
  }

  constructor() {
    super();
    this.selectedItemIndex = null;
    this.items = buildFakeProducts(50);
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
              ${this.selectedItemIndex === undefined || this.selectedItemIndex === null
                ? this.fallBackRender()
                : this.renderProductDetail(this.selectedItemIndex)
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
    const { name, description } = this.items[index];

    return html`
      <div>
        <h2>Detail of ${name}</h2>
        <p>${description}</p>
      </div>
    `;
  }
  
}

customElements.define('modal-store', StoreModal);

/**
 * STATIC DATA -> MOVE THEME ELSEWHERE
 */

function buildFakeProduct(id) {
  return {
    id,
    name: "Potion",
    description: `Awesome potion ${id}, take it.`,
    gains: { property1: "Gain 1", property2: "Gain 2", property3: "Gain 3"}
  }
}

function buildFakeProducts(count) {
  const products = []
  for (let index = 0; index <= count; index++) {
    products.push(buildFakeProduct(index))
  }

  return products;
}