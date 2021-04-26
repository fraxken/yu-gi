// Import Third-party Dependencies
import { LitElement, html, css } from 'lit-element';
import { progressionParser } from "../../../../assets/scripts/helpers/index";

import openURL from "../../../images/biome_open.png";
import closeURL from "../../../images/biome_close.png";

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
                width: 560px;
                display: flex;
                flex-direction: column;
                position: relative;
            }

            .picker > .niveau {
                height: 90px;
                display: flex;
                flex-direction: column;
                background: #2d2d2d;
                background: -moz-linear-gradient(top,  #2d2d2d 0%, #1c1916 100%);
                background: -webkit-linear-gradient(top,  #2d2d2d 0%,#1c1916 100%);
                background: linear-gradient(to bottom,  #2d2d2d 0%,#1c1916 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#2d2d2d', endColorstr='#1c1916',GradientType=0 );
                border: 2px solid black;
                padding: 5px;
                border-radius: 10px;
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
                border: 2px solid black;
                overflow: hidden;
            }
            .niveau .rooms .room.unlock {
                border-color: #FFF !important;
                cursor: pointer;
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

    roomClicked(isLocked, dataid) {
        if (isLocked) {
            return;
        }

        const [roomId, niveauId] = progressionParser(dataid);
        const player = game.rootScene.findChild("player", true);
        const script = player.getScriptedBehavior("PlayerBehavior");

        hudevents.emit("picker", false);
        script.sendMessage("enterDungeon", roomId, niveauId);
    }

    generateRoom(niveau) {
        let [roomOneLocked, roomTwoLocked, roomThreeLocked] = [true, true, true];
        if (niveau <= this.niveauId) {
            const inferiorNiveau = niveau < this.niveauId;
            roomOneLocked = false;
            roomTwoLocked = inferiorNiveau || this.roomId >= 2 ? false : true;
            roomThreeLocked = inferiorNiveau || this.roomId >= 3 ? false : true;
        }
        const nv1 = "1." + niveau;
        const nv2 = "2." + niveau;
        const nv3 = "3." + niveau;

        return html`
            <div class="room ${roomOneLocked ? "lock" : "unlock"}" @click=${() => this.roomClicked(roomOneLocked, nv1)}>
                <img  src=${roomOneLocked ? closeURL : openURL} />
            </div>
            <div class="room ${roomTwoLocked ? "lock" : "unlock"}" @click=${() => this.roomClicked(roomOneLocked, nv2)}>
                <img data-id="2.${niveau}" src=${roomTwoLocked ? closeURL : openURL} />
            </div>
            <div class="room ${roomThreeLocked ? "lock" : "unlock"}" @click=${() => this.roomClicked(roomOneLocked, nv3)}>
                <img data-id="3.${niveau}" src=${roomThreeLocked ? closeURL : openURL} />
            </div>
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
