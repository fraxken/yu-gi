import { LitElement, html, css } from 'lit-element';

import './product-detail';

class StoreModal extends LitElement {
  static get properties() {
    return {
      selectedItemIndex: { type: Number },
      items: { type: Array }
    }
  }

  static get styles() {
    return css`
      .modal-store {
        min-width: 600px;
      }
      .modal-store-column-wrapper {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: calc(100vh - 200px);
        gap: 0px 8px;
      }
      .main-list {
        height: calc(100% - 10px);
        overflow-y: scroll;
      }
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      li {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 5px;
      }
      .list-name {
        margin: 0;
        margin-bottom: 10px;
      }
      .even {
        background-color: red;
        background-color: rgba(255, 255, 255, 0.2);
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
          <h3 class="list-name">
            Available cards (${this.items.length})
          </h3>
          <div class="main-list">
            ${this.renderProductList()}
          </div>
          </div>
          <div class="modal-store-column product-detail">
            <product-detail .product=${this.items[this.selectedItemIndex]}></product-detail>
          </div>
        </div>
      </div>
    `;
  }

  handleSelectItem(id) {
    const newIndex = this.items.findIndex(item => item.id === id)
    this.selectedItemIndex = newIndex
  }

  renderProductList() {
    return html`
      <ul>
        ${this.items.map((item, index) => html`
          <li
            class=${index % 2 ? "odd" : "even"}
            @click=${() => this.handleSelectItem(item.id)}
          >
            ${item.name}
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('modal-store', StoreModal);

/**
 * STATIC IT -> MOVE THEME ELSEWHERE
 */

function buildFakeProduct(id) {
  return {
    id,
    name: `Potion n ${id}`,
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