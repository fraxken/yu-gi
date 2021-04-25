import { LitElement, css, html } from "lit-element";


class ActionKeys extends LitElement {

    static get styles() {
        return css`
        .action-keys-container {
           display:flex;
           margin-right: 65px;
           flex-direction: column;
        }
        .container {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        `;
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="action-keys-container">
                <move-keys
                    upKey='Z'
                    downKey='S'
                    leftKey='Q'
                    rightKey='D'    
                ></move-keys>
                <!-- <move-keys
                    upKey='UP'
                    downKey='DOWN'
                    leftKey='LEFT'
                    rightKey='RIGHT'    
                ></move-keys> -->
                <div class='container'>
                    <action-key key='E' typeAction='ACTION'></action-key>
                    <action-key key='U' typeAction='DECK'></action-key>
                </div>
            </div>
        `;
    }
}

customElements.define("action-keys", ActionKeys);
