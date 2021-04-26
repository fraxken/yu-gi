import { css, LitElement, html } from 'lit-element';

import { buildFakeCards } from '../../../fixtures';

class TrunkModal extends LitElement {
    static get styles() {
        return css`
            .modal-trunk {
                padding: 20px;
                border: 5px solid red;
                border-radius: 10px;
                display: flex;
            }
            .modal-trunk .card-slot {
                width: 200px;
                height: 200px;
                background: red;
                display: flex;
                flex-direction: column;sq
            }
            .modal-trunk .card-slot + .card-slot {
                margin-left: 20px;
            }
        `;
    }

    constructor() {
        super();

        console.log(window.trunkCards);
        this.cards = Array.isArray(window.trunkCards) ? window.trunkCards : buildFakeCards(3);
    }

    *getCards() {
        for (const card of this.cards) {
            console.log(card);

            yield html`
            <div class="card-slot">
                <render-slot .card='${card}' name='boo' typeCard='offensive'></render-slot>
            </div>
            `;
        }
    }

    render() {
        return html`
            <div class="modal-trunk">${[...this.getCards()].concat()}</div>
        `;
    }
}

customElements.define('modal-trunk', TrunkModal);

