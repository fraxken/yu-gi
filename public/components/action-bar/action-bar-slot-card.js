import { LitElement, css, html } from "lit-element";

class ActionBarSlotCard extends LitElement {

    static get styles() {
        return css`
            .action-bar-container {
                display: grid;
                grid-template-columns: repeat(5, 80px);
                gap: 20px;
                height: 100px;
                margin-bottom: 40px;
            }
        `;
    }

    constructor() {
        super();
        this.isTest = false;
    }

    render() {
        return html`
            <div class='action-bar-container'>
                <action-card card='{ "typeCard" : "actif_att", "key" : "MOUSE_RIGHT_CLICK" }'></action-card>
                <action-card card='{ "typeCard" : "actif_def", "key" : "MOUSE_LEFT_CLICK"  }'></action-card>
                <action-card card='{ "typeCard" : "passif" }'></action-card>
                <action-card card='{ "typeCard" : "conso", "key" : "1"  }'></action-card>
                <refresh-action-card key='2'></refresh-action-card>
            </div>
        `;
    }
}

customElements.define("action-bar-slot-card", ActionBarSlotCard);
