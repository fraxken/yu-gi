import { css, html, LitElement } from 'lit-element'


class DeckModal extends LitElement {
    static get properties() {
        return {
            deck: { type: Object },
            selectedId: { type: Number }
        }
    }

    static get styles() {
        return css`
            .modal-deck {
                min-width: 600px;
                padding: 20px;
                box-shadow: 1px 1px 10px black;
                background: rgba(20, 40, 20, 0.65);
                border-radius: 10px;
            }
            .list-card {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
                gap: 10px 8px;
                overflow-y: scroll;
                height: 250px;
                width: 100%;
            }
        `;
    }

    constructor() {
        super();
        const state = game.state;
        this.deck = state.getState("deck");
        console.log(this.deck);
        this.selectedId = -1;
    }

    selectedCard(index) {
        this.selectedId = index;
    }

    renderWrapper(card, index) {
        return html`
        <div @click='${() => this.selectedCard(index)}'>
            <render-card .card="${card}"></render-card>
        </div>
        `
    }

    renderList() {
        return html`
            <div class="list-card">
                ${this.deck.draw.map((card, index) => this.renderWrapper(card, index))}
            </div>
        `
    }

    renderSlotSelector() {
        return html`
            <div >
               Selector
            </div>
        `;
    }

    render() {
        return html`
            <div class="modal-deck">
                <h1>Deck</h1>
                ${this.selectedId === -1 ? this.renderList() : this.renderSlotSelector()}
            </div>
        `;
    }
}

customElements.define('modal-deck', DeckModal);