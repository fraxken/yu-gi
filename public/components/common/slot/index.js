import { LitElement, css, html } from "lit-element";


class Slot extends LitElement {
    static get properties() {
        return {
            card: { type: Object },
            typeCard: { type: String },
            key: { type: String }
        };
    }

    static get styles() {
        return css`
            .card-container {
                height: 175px;
                width: 135px;
                position: relative;
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
                position: absolute;
                font-family: Roboto;
                font-size: smaller;
                color: white;
                text-shadow: rgb(116 116 116) 1px 1px 1px;
                top: 31px;
            }
            .stars {
                height: 76px;
                width: 17px;
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
            }
            .left {
                top: 50px;
                left: 13px;
            }
            .right {
                top: 50px;
                right: 20px;
            }
            .star-on {
                background: url('./images/icons/starOn.png') no-repeat;
                height: 10px;
                width: 10px
            }
            .star-off-defensive {
                background: url('./images/icons/starOff-defensive.png') no-repeat;
                height: 10px;
                width: 10px
            }
            .star-off-offensive {
                background: url('./images/icons/starOff-offensive.png') no-repeat;
                height: 10px;
                width: 10px
            }
            .star-off-passive {
                background: url('./images/icons/starOff-passive.png') no-repeat;
                height: 10px;
                width: 10px;
            }
            .star-off-consumable {
                background: url('./images/icons/starOff-consumable.png') no-repeat;
                height: 10px;
                width: 10px
            }
            .desc {
                position: absolute;
                color: white;
                bottom: 27px;
                left: 10px;
                width: 103px;
                text-align: center;
            }
            .icon {
                height: 18px;
                width: 18px;
            }
            .icon-type-offensive {
                position: absolute;
                top: 10px;
                left: 12px;
            }
            .icon-type-defensive {
                position: absolute;
                top: 9px;
                left: 42px;
            }
            .icon-type-passive {
                position: absolute;
                top: 10px;
                left: 72px;
            }
            .icon-type-consumable {
                position: absolute;
                top: 10px;
                left:102px;
            }
            .icon-offensive-offensive {
                background: url(./images/icons/offensif/offensif.png) no-repeat;
            }
            .icon-offensive-defensive {
                background: url(./images/icons/offensif/defensif.png) no-repeat;
            }
            .icon-offensive-passive {
                background: url(./images/icons/offensif/passif.png) no-repeat;
            }
            .icon-offensive-consumable {
                background: url(./images/icons/offensif/consommable.png) no-repeat;
            }
            .icon-defensive-offensive {
                background: url(./images/icons/defensif/offensif.png) no-repeat;
            }
            .icon-defensive-defensive {
                background: url(./images/icons/defensif/defensif.png) no-repeat;
            }
            .icon-defensive-passive {
                background: url(./images/icons/defensif/passif.png) no-repeat;
            }
            .icon-defensive-consumable {
                background: url(./images/icons/defensif/consommable.png) no-repeat;
            }
            .icon-passive-offensive {
                background: url(./images/icons/passif/offensif.png) no-repeat;
            }
            .icon-passive-defensive {
                background: url(./images/icons/passif/defensif.png) no-repeat;
            }
            .icon-passive-passive {
                background: url(./images/icons/passif/passif.png) no-repeat;
            }
            .icon-passive-consumable {
                background: url(./images/icons/passif/consommable.png) no-repeat;
            }
            .icon-consumable-offensive {
                background: url(./images/icons/consommable/offensif.png) no-repeat;
            }
            .icon-consumable-defensive {
                background: url(./images/icons/consommable/defensif.png) no-repeat;
            }
            .icon-consumable-passive {
                background: url(./images/icons/consommable/passif.png) no-repeat;
            }
            .icon-consumable-consumable {
                background: url(./images/icons/consommable/consommable.png) no-repeat;
            }
            .body-slot {
                position: absolute;
                height: 60px;
                width: 60px;
                top: 60px;
                left: 35px;
                display: flex;
                flex-direction: column;
            }
            .icon-small {
                transform: scale(0.6);
            }
            .small-info {
                display: flex;
                align-items: center;
            }
            .small-description {
                font-size: 10px;
                text-overflow: ellipsis;
            }
            .button {
                position: absolute;
                bottom: 13px;
                right: 10px;
            }
        `;
    }

    constructor() {
        super();
        this.card = {};
        this.key = '';
        this.typeCard = 'offensive';
    }

    renderLeftStars(nbStars) {

        let nbTemp = nbStars;

        if (nbStars > 5) {
            nbTemp = 5;
        }

        return html`
            <span class="stars left">
                ${[...new Array(nbTemp)].map(_ => html`<span class="star-on"></span>`)}
                ${[...new Array(5 - nbTemp)].map(_ => html`<span class="${`star-off-${this.typeCard}`}"></span>`)}
            </span>
        `;
    }

    renderRightStars(nbStars) {

        let nbTemp = 0;

        if (nbStars > 5) {
            nbTemp = nbStars - 5;
        }

        return html`
            <span class="stars right">
                ${[...new Array(nbTemp)].map(_ => html`<span class="star-on"></span>`)}
                ${[...new Array(5 - nbTemp)].map(_ => html`<span class="${`star-off-${this.typeCard}`}"></span>`)}
            </span>
        `;
    }

    renderDescriptionSkill(card, type) {

        let description = '';

        switch (type) {
            case 'offensive':
                description = card.offensiveSkill.name
                break;
            case 'defensive':
                description = card.defensiveSkill.name
                break;
            case 'passive':
                description = card.passiveSkill.name
                break;
            case 'consumable':
                description = card.consumableSkill.name
                break;
        }

        return html`
            <span class="desc">${description}</span>
        `;
    }

    renderIconsTop(typeIcons, typeCard) {
        return html`
            <span class="${`icon icon-type-${typeIcons} icon-${typeIcons}-${typeCard} `}"></span>
        `
    }

    renderBody(card, typeCard) {

        const tab = [];

        if (typeCard !== 'offensive') {
            tab.push(
                html`
                    <span class="small-info">
                        <div class="icon icon-offensive-offensive icon-small"></div>
                        <span class="small-description">${card.offensiveSkill.name}</span>
                    </span>
                `
            )
        }

        if (typeCard !== 'defensive') {
            tab.push(
                html`
                    <span class="small-info">
                    <div class="icon icon-defensive-defensive icon-small"></div>
                    <span class="small-description">${card.defensiveSkill.name}</span>
                </span>
                `
            )
        }

        if (typeCard !== 'passive') {
            tab.push(
                html`
                    <span class="small-info">
                    <div class="icon icon-passive-passive icon-small"></div>
                    <span class="small-description">${card.passiveSkill.name}</span>
                </span>
                `
            )
        }

        if (typeCard !== 'consumable') {
            tab.push(
                html`
                    <span class="small-info">
                    <div class="icon icon-consumable-consumable icon-small"></div>
                    <span class="small-description">${card.consumableSkill.name}</span> 
                </span>
                `
            )
        }

        return html`
            <span class="body-slot">
                ${tab.map(element => element)}
            </span>
        `
    }

    render() {
        return html`
            <div class="${`card-container card-container-${this.typeCard}`}">
                ${this.renderIconsTop('offensive', this.typeCard)}
                ${this.renderIconsTop('defensive', this.typeCard)}
                ${this.renderIconsTop('passive', this.typeCard)}
                ${this.renderIconsTop('consumable', this.typeCard)}
                <span class="card-name">${this.card.name}</span>
                ${this.renderLeftStars(this.card.stars)}
                ${this.renderRightStars(this.card.stars)}
                ${this.renderDescriptionSkill(this.card, this.typeCard)}
                ${this.renderBody(this.card, this.typeCard)}
                <span class="button">
                    <keyboard-icon key="${this.key}"></keyboard-icon>
                </span>
            </div>
        `;
    }
}

customElements.define("render-slot", Slot);
