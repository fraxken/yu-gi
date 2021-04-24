import { LitElement, css, html } from "lit-element";

class ActionBarSlotCard extends LitElement {

    static get styles() {
        return css`
            .action-bar-container {
                display: grid;
                grid-template-columns: repeat(5, 100px);
                gap: 12px;
                height: 150px;
                margin-bottom: 8px;
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
                <!-- <action-card card='{ "typeCard" : "actif_att", "key" : "A" }'></action-card>
                <action-card card='{ "typeCard" : "actif_def", "key" : "B"  }'></action-card>
                <action-card card='{ "typeCard" : "passif", "key" : "C"  }'></action-card>
                <action-card card='{ "typeCard" : "conso", "key" : "D"  }'></action-card> -->
                <keyboard-icon key='A' ?isPress=${true}></keyboard-icon>
                <keyboard-icon key='A' ?isPress=${false}></keyboard-icon>
                <keyboard-icon key='MOUSE_LEFT_CLICK' ?isPress=${true}></keyboard-icon>
                <keyboard-icon key='MOUSE_FULL_CLICK' ?isPress=${true}></keyboard-icon>
            </div>
        `;
    }
}

customElements.define("action-bar-slot-card", ActionBarSlotCard);
