import { css, html, LitElement } from 'lit-element'

import { buildFakeCards } from '../../../fixtures'

class RecuperatorDeckModal extends LitElement {
  static get properties() {
    return {
      cards: { type: Array },
      selectedCardIds: { type: Array }
    }
  }

  static get styles() {
    return css`
      .modal-recuperator-deck {
        min-width: 600px;
        padding: 20px;
        box-shadow: 1px 1px 10px black;
        background: rgba(20, 40, 20, 0.65);
        border-radius: 10px;
      }
      .modal-recuperator-deck-card {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px 8px;
        overflow-y: scroll;
        height: 250px;
        width: 100%;
      }

      .card-wrapper {
        width: 80px;
        height: 100px;
        margin-right: 4px;
        margin-bottom: 4px;
        font-size: 8px;
        cursor: pointer;
      }
      .selected {
        z-index: 2;
        position: relative;
        bottom: 30px;
        left: 4px;
        color: green;
      }
      .save-button {
        margin-top: 10px;
        font-weight: bold;
        padding: 10px 10px 10px 10px ;
        background-color: lightgray;
        border-radius: 7px;
        box-shadow: 0 .2em gray; 
        cursor: pointer;
      }
    `;
  }

  constructor() {
    super();
    this.cards = buildFakeCards(30);
    this.selectedCardIds = [];

    this.handleSubmitSelect = this.handleSubmitSelect.bind(this)
  }

  render() {
    return html`
      <div class="modal-recuperator-deck">
        <h1>Recuperator deck</h1>
        <p>Choose one or several card to revive</p>
        <div class="modal-recuperator-deck-card">
          <!-- 🤮 poor this -->
          ${this.cards && this.cards.length
            ? this.cards.map(this.renderCard(this))
            : html`No cards to revive`
          }
          <!-- 🤮 -->
        </div>
        <button
          class="save-button"
          ?disabled=${!this.selectedCardIds.length}
          @click=${this.handleSubmitSelect}
        >
          Revive ${this.selectedCardIds.length} cards
        </button>
      </div>
    `;
  }

  handleSubmitSelect() {
    if (this.selectedCardIds.length) {
      alert(`You save card: ${this.selectedCardIds.reduce((acc, id) => (acc += `${id},`), '')}`)
      this.selectedCardIds = []
    } else {
      alert('No cards to save.')
    }
  }

  handleSelect(targetId) {
    return () => {
      const isSelected = this.selectedCardIds.includes(targetId)
      if (isSelected) {
        this.selectedCardIds = this.selectedCardIds.filter(id => id !== targetId);
      } else {
        this.selectedCardIds = [...this.selectedCardIds, targetId];
      }
    }
  }

  renderCard(self) { // 🤮
    return (card) => {
      const isSelected = self.selectedCardIds.includes(card.id);
  
      return html`
        <div class="card-wrapper" @click=${self.handleSelect(card.id)}>
          <action-card .card=${{ typeCard: card.name }}></action-card>
          ${isSelected ? html`<div class="selected">✅</div>` : null}
        </div>
      `;
    }
  }
}

customElements.define('modal-recuperator-deck', RecuperatorDeckModal);
