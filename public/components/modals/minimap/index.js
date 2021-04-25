import { LitElement, html, css } from 'lit-element';

import roomIconURL from "../../../images/minimap/room.png";
import specialIconURL from "../../../images/minimap/special.png";
import bossIconURL from "../../../images/minimap/boss.png";
import endIconURL from "../../../images/minimap/end.png";
import startIconURL from "../../../images/minimap/start.png";
import recuperateurIconURL from "../../../images/minimap/recuperateur.png";
import survivalIconURL from "../../../images/minimap/survival.png";
import trapIconURL from "../../../images/minimap/trap.png";
import parcoursIconURL from "../../../images/minimap/parcours.png";

class Minimap extends LitElement {
    static Icons = {
        room: roomIconURL,
        special: specialIconURL,
        boss: bossIconURL,
        end: endIconURL,
        start: startIconURL,
        recuperateur: recuperateurIconURL,
        survival: survivalIconURL,
        trap: trapIconURL,
        parcours: parcoursIconURL
    }

    static get properties() {
        return { name: { type: String } };
    }

    static get styles() {
        return css`
            p, b {
                margin: 0;
                padding: 0;
            }
            .minimap {
                width: 480px;
                height: 300px;
                display: flex;
                flex-wrap: wrap;
                position: relative;
            }

            .minimap > .room {
                flex-basis: 150px;
                flex-grow: 1;
                height: 95px;
                background: blue;
                margin-right: 5px;
                margin-bottom 5px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .minimap > .room.hidden {
                background: none;
                border: none;
            }

            .centered-room {
                width: 120px;
                height: 60px;
                background: green;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                border-radius: 10px;
                flex-direction: column;
            }
            .centered-room > img {
                width: 30px;
                height: 30px;
            }
            .centered-room > b {
                font-size: 13px;
            }
            .centered-room .left {
                width: 20px;
                height: 20px;
                background: red;
                border-radius: 2px;
                position: absolute;
                left: -10px;
                top: 20px;
            }
            .centered-room .right {
                width: 20px;
                height: 20px;
                background: red;
                border-radius: 2px;
                position: absolute;
                right: -10px;
                top: 20px;
            }
            .centered-room .top {
                width: 20px;
                height: 20px;
                background: red;
                border-radius: 2px;
                position: absolute;
                right: 50px;
                top: -10px;
            }
            .centered-room .bottom {
                width: 20px;
                height: 20px;
                background: red;
                border-radius: 2px;
                position: absolute;
                right: 50px;
                bottom: -10px;
            }
        `
    }

    constructor() {
        super();

        this.minimap = game.rootScene.getMinimapData();
    }

    drawDoor(sideName) {
        return html`<div class="${sideName}"></div>`;
    }

    drawRoom(side) {
        if (this.minimap.currentRoom.side.has(side)) {
            const room = this.minimap.connectedRooms.get(side);
            console.log(room.type);

            return html`<div class="room">
                <div class="centered-room">
                    <!-- <p>${room.id}</p> -->
                    <img src="${Minimap.Icons[room.type]}"></img>
                    ${[...room.side].map(this.drawDoor)}
                </div>
            </div>`;
        }
        else {
            return html`<div class="room hidden"></div>`;
        }
    }

    render() {
        return html`
            <div class="minimap">
                <div class="room hidden"></div>
                ${this.drawRoom("top")}
                <div class="room hidden"></div>

                ${this.drawRoom("left")}
                <div class="room">
                    <div class="centered-room">
                        <!-- <p>${this.minimap.currentRoom.id}</p> -->
                        <img src="${Minimap.Icons[this.minimap.currentRoom.type]}"></img>
                        ${[...this.minimap.currentRoom.side].map(this.drawDoor)}
                    </div>
                </div>
                ${this.drawRoom("right")}

                <div class="room hidden"></div>
                ${this.drawRoom("bottom")}
                <div class="room hidden"></div>
            </div>
        `;
    }
}

customElements.define('mini-map', Minimap);