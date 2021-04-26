import { LitElement, css, html } from "lit-element";


class ActionKeys extends LitElement {

    static get properties() {
        return {
            typeController: { type: String }
        }
    }

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

    _handleChangeKeyboard(e) {
        this.typeController = e;
    }

    constructor() {
        super();
        this.typeController = 'KeyboardL'
        window.hudevents.on("input_type", this._handleChangeKeyboard.bind(this));
    }

    _renderMoveKeys() {
        if (this.typeController === 'KeyboardL') {
            return html`
                <move-keys
                    upKey='Z'
                    downKey='S'
                    leftKey='Q'
                    rightKey='D'    
                ></move-keys>
            `
        }
        if (this.typeController === 'KeyboardR') {
            return html`
                <move-keys
                    upKey='UP'
                    downKey='DOWN'
                    leftKey='LEFT'
                    rightKey='RIGHT'      
                ></move-keys>
            `
        }
    }

    render() {
        return html`
            <div class="action-keys-container">
                ${this._renderMoveKeys()}
                <div class='container'>
                    <action-key key='E' typeAction='ACTION'></action-key> 
                    <action-key key='U' typeAction='DECK'></action-key>
                </div>
            </div>
        `;
    }
}

customElements.define("action-keys", ActionKeys);
