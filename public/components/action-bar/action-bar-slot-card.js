import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../../helpers";
class ActionBarSlotCard extends LitElement {

    static get properties() {
        return {
            offensive: { type: Object },
            defensive: { type: Object },
            passive: { type: Object },
            consumable: { type: Object }
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
        bindToScriptEvent(this, "deck.slotHUD.offensive", "offensive");
        bindToScriptEvent(this, "deck.slotHUD.defensive", "defensive");
        bindToScriptEvent(this, "deck.slotHUD.passive", "passive");
        bindToScriptEvent(this, "deck.slotHUD.consumable", "consumable");
    }

    render() {
        return html`
            <div class='action-bar-container'>
                <render-slot .card='${this.offensive}' typeCard='offensive' key='1'></render-slot>
                <render-slot .card='${this.defensive}' typeCard='defensive'  key='2'></render-slot>
                <render-slot .card='${this.passive}' typeCard='passive'></render-slot>
                <render-slot .card='${this.consumable}' typeCard='consumable' key='3'></render-slot>
                <refresh-action-card key='X'></refresh-action-card>
            </div>
        `;
    }
}

customElements.define("action-bar-slot-card", ActionBarSlotCard);
