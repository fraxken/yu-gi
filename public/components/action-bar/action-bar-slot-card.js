import { LitElement, css, html } from "lit-element";

class ActionBarSlotCard extends LitElement {

    static get properties() {
        return {
            slotHUD: { type: Object }
        }
    }

    static get styles() {
        return css`
            .action-bar-container {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 10px;
                margin-bottom: 40px;
            }
        `;
    }

    constructor() {
        super();
        const state = game.state;
        this.slotHUD = state.getState("deck.slotHUD");
        console.log(this.slotHUD);
    }

    render() {
        return html`
            <div class='action-bar-container'>
                <render-slot .card='${this.slotHUD.offensive}' typeCard='offensive' key='1'></render-slot>
                <render-slot .card='${this.slotHUD.defensive}' typeCard='defensive'  key='2'></render-slot>
                <render-slot .card='${this.slotHUD.passive}' typeCard='passive'></render-slot>
                <render-slot .card='${this.slotHUD.consumable}' typeCard='consumable' key='3'></render-slot>
                <refresh-action-card key='X'></refresh-action-card>
            </div>
        `;
    }
}

customElements.define("action-bar-slot-card", ActionBarSlotCard);
