import { css, LitElement, html } from 'lit-element';
import { Card } from '../../../../assets/scripts/helpers/Deck/Card';

import { buildFakeCards } from '../../../fixtures';

class TrunkModal extends LitElement {
    static get styles() {
        return css`
            .modal-trunk {
                padding: 60px;
                background: #474747;
                background: -moz-linear-gradient(top,  #474747 0%, #1e1812 100%);
                background: -webkit-linear-gradient(top,  #474747 0%,#1e1812 100%);
                background: linear-gradient(to bottom,  #474747 0%,#1e1812 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#474747', endColorstr='#1e1812',GradientType=0 );
                border: 4px solid black;
                border-radius: 10px;
                display: flex;
            }
            .modal-trunk .card-slot {
                display: flex;
                flex-direction: column;
            }
            .modal-trunk .card-slot + .card-slot {
                margin-left: 80px;
            }
            .modal-trunk .card-slot .pick {
                height: 40px;
                background: #95a5a5;
                background: -moz-linear-gradient(top,  #95a5a5 0%, #596a72 100%);
                background: -webkit-linear-gradient(top,  #95a5a5 0%,#596a72 100%);
                background: linear-gradient(to bottom,  #95a5a5 0%,#596a72 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#95a5a5', endColorstr='#596a72',GradientType=0 );
                color: black;
                box-sizing: border-box;
                border-radius: 10px;
                border: 2px solid black;
                padding: 0 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Roboto;
                margin-top: 20px;
                font-weight: bold;
                letter-spacing: 1px;
            }
            .modal-trunk .card-slot .pick:hover {
                cursor: pointer;
                border-color: #FFF;
                color: #FFF;
                text-shadow: 2px 2px 2px black;
            }
        `;
    }

    constructor() {
        super();

        /** @type {Card[]} */
        this.cards = Array.isArray(window.trunkCards) ? window.trunkCards : buildFakeCards(3);
    }

    addCardToDeck(event) {
        const id = event.target.getAttribute("data-id");
        const [card] = this.cards.splice(id, 1);
        console.log(card);
        // TODO: add card to the deck!

        this.update();
    }

    *fetchCardsInCurrentChest() {
        for (let id = 0; id < this.cards.length; id++) {
            const card = this.cards[id];
            // Type of the card ?? typeCard
            console.log(card);

            yield html`
            <div class="card-slot">
                <render-slot .card='${card}' typeCard='offensive'></render-slot>
                <div class="pick" data-id=${id} @click=${this.addCardToDeck}>ADD TO DECK</div>
            </div>
            `;
        }
    }

    render() {
        return html`
            <div class="modal-trunk">${[...this.fetchCardsInCurrentChest()].concat()}</div>
        `;
    }
}

customElements.define('modal-trunk', TrunkModal);

