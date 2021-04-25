import { css, LitElement, html } from 'lit-element';

import { buildFakeCards } from '../../../fixtures';

class TrunkModal extends LitElement {
  static get properties() {
    return {
      cards: { type: Array },
      selectedCardIds: { type: Array },
      handLimit: { type: Number }
    }
  }

  static get styles() {
     return css`
      .modal-trunk {
        padding: 20px;
        box-shadow: 1px 1px 10px black;
        background: rgba(20, 40, 20, 0.65);
        border-radius: 10px;
      }

      .modal-trunk-deck-card {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px 8px;
        height: 200px;
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
        color: gray
      }
      .base-button {
        margin-top: 10px;
        font-weight: bold;
        padding: 10px 10px 10px 10px ;
        border-radius: 7px;
        box-shadow: 0 .2em gray;
        cursor: pointer;
      }
      .pick-up-button {
        background-color: burlywood;
        width: 80px;
      }
      .close-button {
        background-color: orangered;
      }
      .close-button-wrapper {
        display: flex;
        justify-content: space-around;
      }
    `;
  }

  constructor() {
    super();

    this.cards = window.trunkCards || buildFakeCards(3);
    this.selectedCardIds = [];
    this.handLimit = 2;
  }

  get selectedCardCount() {
    return this.selectedCardIds.length;
  }

  render() {
    const remainingCards = this.computeRemainingCards()

    return html`
        <div class="modal-trunk">
          <h1>Trunk content</h1>
          ${this.cards.length > 0
            ? html`<p>You can pick ${remainingCards} cards in this trunk:</p>`
            : null
          }
          <div class="modal-trunk-deck-card">
            <!-- 🤮 poor this -->
            ${this.cards && this.cards.length
              ? this.cards.map(this.renderCard(this))
              : html`No cards to revive`
            }
            <!-- 🤮 -->
          </div>
          <div class="close-button-wrapper">
            <button
              class="base-button close-button"
              @click=${this.submitSelection}
            >
              Close the trunk and pick ${this.selectedCardCount} cards up.
            </button>
          </div>
        </div>
    `;
  }

  submitSelection() {
    alert(`You picked ${this.selectedCardCount} cards.`)
    this.selectedCardIds = []
  }

  computeRemainingCards() {
    const { handLimit, cards, selectedCardCount } = this;

    if (handLimit > cards.length) {
      return cards.length - selectedCardCount
    }

    return handLimit - selectedCardCount;
  }

  removeIdFromSelection(targetId) {
    this.selectedCardIds = this.selectedCardIds.filter(id => id !== targetId);
  }

  addIdToSelection(targetId) {
    this.selectedCardIds = [...this.selectedCardIds, targetId];
  }

  handleSelect(targetId) {
    return () => {
      const isSelected = this.selectedCardIds.includes(targetId);
      if (isSelected) {
        this.removeIdFromSelection(targetId);
      } else {
        const isHandFull = this.selectedCardCount >= this.handLimit;

        if (!isHandFull) {
          this.addIdToSelection(targetId);
        } else {
          alert('Your hand is full');
        }
      }
    }
  }

  renderCard(self) { // 🤮
    return (card) => {
      const isSelected = self.selectedCardIds.includes(card.id);

      return html`
        <div class="card-wrapper">
          <action-card .card=${{ typeCard: card.name }}></action-card>
          <button
            class="base-button pick-up-button ${isSelected && "selected"}"
            @click=${self.handleSelect(card.id)}
          >
            Pick up
          </button>
        </div>
      `;
    }
  }
}

customElements.define('modal-trunk', TrunkModal);

