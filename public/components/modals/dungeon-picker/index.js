// Import Third-party Dependencies
import { LitElement, html, css } from 'lit-element';
import { progressionParser } from "../../../../assets/scripts/helpers/index"

class DungeonPicker extends LitElement {
    static get properties() {
        return { name: { type: String } };
    }

    static get styles() {
        return css`
            p, div {
                margin: 0;
                padding: 0;
            }

            .picker {
                width: 500px;
                display: flex;
                flex-direction: column;
                position: relative;
            }

            .picker > .niveau {
                height: 90px;
                display: flex;
                flex-direction: column;
                box-shadow: 1px 1px 10px black;
                background: rgba(20, 40, 20, 0.65);
                padding: 5px;
            }
            .picker > .niveau + .niveau {
                margin-top: 16px;
            }

            .niveau > p {
                height: 20px;
                flex-shrink: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 15px;
                font-family: Roboto;
                font-weight: bold;
                text-shadow: 2px 2px 4px black;
                padding-top: 5px;
                letter-spacing: 1px;
            }

            .niveau .rooms {
                display: flex;
                flex-grow: 1;
                justify-content: space-evenly;
                align-items: center;
            }

            .niveau .rooms .room {
                width: 140px;
                height: 45px;
                background: #37474F;
                border-radius: 10px;
            }

            .niveau .rooms .room.locked {
                background: red !important;
            }
        `
    }

    constructor() {
        super();

        const state = game.state;
        const [roomId, niveauId] = progressionParser(state.getState("dungeon.progression"));

        this.roomId = roomId;
        this.niveauId = niveauId;
    }

    roomClicked(event) {
        const isLocked = event.target.classList.contains("locked");
        if (isLocked) {
            return;
        }

        const [roomId, niveauId] = progressionParser(event.target.getAttribute("data-id"));
        const player = game.rootScene.findChild("player", true);
        const script = player.getScriptedBehavior("PlayerBehavior");

        hudevents.emit("picker", false);
        script.sendMessage("enterDungeon", roomId, niveauId);
    }

    generateRoom(niveau) {
        let [roomOneLocked, roomTwoLocked, roomThreeLocked] = ["room locked", "room locked", "room locked"];
        if (niveau <= this.niveauId) {
            roomOneLocked = "room";
            roomTwoLocked = this.roomId >= 2 ? "room" : "room locked";
            roomThreeLocked = this.roomId >= 3 ? "room" : "room locked";
        }

        return html`
            <div class=${roomOneLocked} data-id="1.${niveau}" @click=${this.roomClicked}></div>
            <div class=${roomTwoLocked} data-id="2.${niveau}" @click=${this.roomClicked}></div>
            <div class=${roomThreeLocked} data-id="3.${niveau}" @click=${this.roomClicked}></div>
        `;
    }

    *generateNiveau() {
        for (let niveau = 1; niveau <= 3; niveau++) {
            yield html`
            <div class="niveau">
                <p>Profondeur ${niveau}</p>
                <div class="rooms">${this.generateRoom(niveau)}</div>
            </div>
            `;
        }
    }

    render() {
        return html`
            <div class="picker">${[...this.generateNiveau()].concat()}</div>
        `;
    }
}

customElements.define('dungeon-picker', DungeonPicker);
