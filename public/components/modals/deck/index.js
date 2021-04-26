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
                background: #2d2d2d;
                background: -moz-linear-gradient(top,  #2d2d2d 0%, #1c1916 100%);
                background: -webkit-linear-gradient(top,  #2d2d2d 0%,#1c1916 100%);
                background: linear-gradient(to bottom,  #2d2d2d 0%,#1c1916 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#2d2d2d', endColorstr='#1c1916',GradientType=0 );
                border: 2px solid black;
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
            .isSelected {
                border: 1px solid white;
                border-radius: 4px;
            }
            .isNotSelected:hover {
                border: 1px solid lightgray;
                border-radius: 4px;
            }
            .isNotSelected {
                border: 1px solid black;
                border-radius: 4px; 
            }
            .slot {
                height: 175px;
                width: 135px;
                margin-left: 20px;
                -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
                filter: grayscale(100%);
            }
            .slot-offensive {
                background: url("./images/slot/offensif.png") no-repeat;
            }
            .slot-defensive {
                background: url("./images/slot/defensif.png") no-repeat;
            }
            .slot-passive {
                background: url("./images/slot/passif.png") no-repeat;
            }
            .slot-consumable {
                background: url("./images/slot/consommable.png") no-repeat;
            }
            .slot-offensive:hover {
                -webkit-filter: grayscale(0%); /* Chrome, Safari, Opera */
                filter: grayscale(0%);
            }
            .slot-defensive:hover {
                -webkit-filter: grayscale(0%); /* Chrome, Safari, Opera */
                filter: grayscale(0%);
            }
            .slot-passive:hover {
                -webkit-filter: grayscale(0%); /* Chrome, Safari, Opera */
                filter: grayscale(0%);
            }
            .slot-consumable:hover {
                -webkit-filter: grayscale(0%); /* Chrome, Safari, Opera */
                filter: grayscale(0%);
            }


            .selector {
                display: flex;
                transform: scale(0.3);
                position: absolute;
                right: -218px;
                top: -63px;
            }
            .header {
                position: relative;
                display: flex;
                justify-content: space-between;
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

        const isSelected = index === this.selectedId;

        return html`
        <div @click='${() => this.selectedCard(index)}' class="${isSelected ? 'isSelected' : 'isNotSelected'}">
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

    handleSelectSlot(selectedId, selectedSlot) {
        window.hudevents.emit('selectSlotForCard', selectedId, selectedSlot);
    }

    renderSlotSelector() {
        if (this.selectedId !== -1) {
            return html`
                <div class="selector">
                    <div class="slot slot-offensive" @click='${() => this.handleSelectSlot(this.selectedId, 'offensive')}'></div>
                    <div class="slot slot-defensive" @click='${() => this.handleSelectSlot(this.selectedId, 'defensive')}'></div>
                    <div class="slot slot-passive" @click='${() => this.handleSelectSlot(this.selectedId, 'passive')}'></div>
                    <div class="slot slot-consumable" @click='${() => this.handleSelectSlot(this.selectedId, 'consumable')}'></div>
                </div>
            `;
        }

    }

    render() {
        return html`
            <div class="modal-deck">
                <div class="header">
                    <h1>Deck</h1>
                    ${this.renderSlotSelector()}
                </div>
                ${this.renderList()}
            </div>
        `;
    }
}

customElements.define('modal-deck', DeckModal);