import { LitElement, html, css } from 'lit-element';

import './card-detail';

class StoreModal extends LitElement {
  static get properties() {
    return {
      selectedCardIndex: { type: Number },
      cards: { type: Array }
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
    this.selectedCardIndex = null;
    this.cards = buildFakeCards(50);
  }

  render() {
    return html`
      <div class="modal-store">
        <h1 class="modal-store-title">Store</h1>
        <div class="modal-store-column-wrapper">
          <div class="modal-store-column">
          <h3 class="list-name">
            Available cards (${this.cards.length})
          </h3>
          <div class="main-list">
            ${this.renderCardList()}
          </div>
          </div>
          <div class="modal-store-column">
            <card-detail .product=${this.cards[this.selectedCardIndex]}></card-detail>
          </div>
        </div>
      </div>
    `;
  }

  handleSelectItem(id) {
    const newIndex = this.cards.findIndex(item => item.id === id)
    this.selectedCardIndex = newIndex
  }

  renderCardList() {
    return html`
      <ul>
        ${this.cards.map((item, index) => html`
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

function buildFakeCard(id) {
  return {
    id,
    name: `Potion n ${id}`,
    description: `Awesome potion ${id}, take it.`,
    offensiveSkill: 3,
    defensiveSkill:  0,
    passiveSkill:  1,
    consumableSkill:  0,
    stars:  5
  }
}

function buildFakeCards(count) {
  const products = []
  for (let index = 0; index <= count; index++) {
    products.push(buildFakeCard(index))
  }

  return products;
}
