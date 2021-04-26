import { LitElement, css, html } from "lit-element";


class Card extends LitElement {
    static get properties() {
        return {
            card: { type: Object }
        };
    }

    static get styles() {
        return css`
            .card-container {
                height: 175px;
                width: 135px;
                position: relative;
                border: 1px solid grey;
                border-radius: 4px;
                color: white;
                background-color: #353535;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

            }
            .card-container-offensive {
                background: url('./images/slot/offensif.png') no-repeat;
            }
            .card-container-defensive {
                background: url('./images/slot/defensif.png') no-repeat;
            }
            .card-container-passive {
                background: url('./images/slot/passif.png') no-repeat;
            }
            .card-container-consumable {
                background: url('./images/slot/consommable.png') no-repeat;
            }
            .card-name {
                height: 20px;
                text-align: center;
                width: 123px;
                font-family: Roboto;
                font-size: smaller;
                color: white;
                text-shadow: rgb(116 116 116) 1px 1px 1px;
            }
            .star-on {
                background: url('./images/icons/starOn.png') no-repeat;
                height: 10px;
                width: 10px;
                margin-left: 6px;
            }
            .icon {
                height: 18px;
                width: 18px;
            }
            .icon-offensive-offensive {
                background: url(./images/icons/offensif/offensif.png) no-repeat;
            }
            .icon-defensive-defensive {
                background: url(./images/icons/defensif/defensif.png) no-repeat;
            }
            .icon-passive-passive {
                background: url(./images/icons/passif/passif.png) no-repeat;
            }
            .icon-consumable-consumable {
                background: url(./images/icons/consommable/consommable.png) no-repeat;
            }
            .body-slot {
                margin-top: 30px;
                height: 60px;
                display: flex;
                flex-direction: column;
            }
            .small-info {
                display: flex;
                align-items: center;
            }
            .small-info + .small-info {
                margin-top: 2px;
            }
            .small-description {
                font-size: 10px;
                text-overflow: ellipsis;
                font-family: Roboto;
                letter-spacing: 1px;
                color: #FFF;
                font-weight: bold;
                text-shadow: 1px 1px 5px rgba(20,20,20, 0.5);
                margin-left: 5px;
            }
            .button {
                position: absolute;
                bottom: 13px;
                right: 10px;
            }
            .star-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `;
    }

    constructor() {
        super();
        this.card = {};
    }

    renderLeftStars(nbStars) {
        return html`<div class="star-container"> <div>${nbStars}</div> <div class="star-on"></div> </div>`;
    }


    renderBody(card) {
        return html`
            <span class="body-slot">
                <span class="small-info">
                    <div class="icon icon-offensive-offensive icon-small"></div>
                    <span class="small-description">${card.offensiveSkill.name}</span>
                </span>
                <span class="small-info">
                    <div class="icon icon-defensive-defensive icon-small"></div>
                    <span class="small-description">${card.defensiveSkill.name}</span>
                </span>
                <span class="small-info">
                    <div class="icon icon-passive-passive icon-small"></div>
                    <span class="small-description">${card.passiveSkill.name}</span>
                </span>
                <span class="small-info">
                    <div class="icon icon-consumable-consumable icon-small"></div>
                    <span class="small-description">${card.consumableSkill.name}</span>
                </span>
            </span>
        `
    }

    render() {
        return html`
            <div class="card-container">
                <span class="card-name">${this.card.name}</span>
                ${this.renderLeftStars(this.card.stars)}
                ${this.renderBody(this.card, this.typeCard)}
            </div>
        `;
    }
}

customElements.define("render-card", Card);
