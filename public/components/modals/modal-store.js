import { LitElement, html, css } from 'lit-element';

class ProductList extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      handleSelectItem: { type: Function }
    };
  }

  static getStyles() {
    return css`
      .main-list {
        height: 80%;
        overflow-y: scroll;
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }

  // get filter option from there
  constructor() {
    super();
    this.items = [];
    this.handleSelectItem = null;
    this._handleSelectItem = this._handleSelectItem.bind(this)
  }

  _handleSelectItem(id) {
    this.handleSelectItem(id)
  }

  renderItem(handleClick) {
    return (item) => {
    const { name, id } = item;

    return html `
      <li @click=${() => handleClick(id)}>${name}</li>
    `;
    }
  }

  render() {
    return html`<div class="main-list">
      List of cards (${this.items.length})
      <ul>
        ${this.items.map(this.renderItem(this._handleSelectItem))}
      </ul>
    </div>`;
  }
}

customElements.define('product-list', ProductList)

class ProductDetail extends LitElement {
  static get properties() {
    return {
      selectedItem: {type: String},
    };
  }

  static getStyles() {
    return css` `
  }

  constructor() {
    super();
    this.selectedItem = {};
  }

  fallBackRender() {
    return html`Please select a product.`;
  }

  renderItems() {
    const { name } = this.selectedItem;

    return html`
      <div>
        <h2>Detail of ${name}</h2>
      </div>
    `;
  }

  render() {
    console.log('updated', this.selectedItem)
    return html`<div>
      ${this.selectedItem && !!this.selectedItem.name
        ? this.renderProductDetail()
        : this.fallBackRender()
      }
    </div>`;
  }
}

customElements.define('product-detail', ProductDetail)

class StoreModal extends LitElement {
  static get properties() {
    return {
      selectedItem: { type: Object },
      items: { type: Array }
    };
  }

  static get styles() {
    return css`
      .modal-store {
        height: 100%;
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
    `
  }

  constructor() {
    super();
    this.selectedItem = null;
    this.items = products;
  }

  _handleSelectItem(id) {
    this.selectedItem = products[id]
    console.log(this.selectedItem)
  }

  render() {
    return html`
      <div class="modal-store">
        <h1 class="modal-store-title">Store</h1>
        <div class="modal-store-column-wrapper">
          <div class="modal-store-column product-list">
            <product-list
              .items=${this.items}
              .handleSelectItem=${this._handleSelectItem}
            ></product-list>
          </div>
          <div class="modal-store-column product-detail">
            <product-detail .selectedItem=${this.selectedItem}></product-detail>
          </div>
        </div>
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
    id: 0,
    name: "Potion",
    description: "Awesome potion, take it.",
    gains: { property1: "Gain 1", property2: "Gain 2", property3: "Gain 3"}
  },
  {
    id: 1,
    name: "Sword",
    description: "Awesome Sword, take it.",
    gains: { property1: "Gain 1", property2: "Gain 2", property3: "Gain 3"}
  },
  {
    id: 2,
    name: "Shield",
    description: "Awesome Shield, take it.",
    gains: { property1: "Gain 1", property2: "Gain 2", property3: "Gain 3"}
  }
];