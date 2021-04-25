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
import secretIconURL from "../../../images/minimap/secret.png";

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
        parcours: parcoursIconURL,
        secret: secretIconURL
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
                width: 510px;
                height: 330px;
                display: flex;
                flex-wrap: wrap;
                position: relative;
            }

            .minimap > .room {
                flex-basis: 150px;
                flex-grow: 1;
                height: 95px;
                margin-right: 15px;
                margin-bottom 20px;
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
                height: 70px;
                background: #191f2b;
                background: -moz-linear-gradient(top,  #191f2b 0%, #283044 100%);
                background: -webkit-linear-gradient(top,  #191f2b 0%,#283044 100%);
                background: linear-gradient(to bottom,  #191f2b 0%,#283044 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#191f2b', endColorstr='#283044',GradientType=0 );
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                border-radius: 10px;
                flex-direction: column;
                border-sizing: border-box;
                border: 4px solid #FFF;
                box-shadow: 3px 3px 10px rgba(80, 20, 20, 0.8);
            }
            .centered-room.selected {
                border-color: #651FFF !important;
            }

            .centered-room > img {
                width: 30px;
                height: 30px;
            }
            .centered-room > p {
                font-size: 13px;
                font-family: Roboto;
                position: absolute;
                bottom: 4px;
                text-align: center;
                letter-spacing: 1px;
                font-weight: bold;
                font-style: "small-caps";
                text-shadow: 1px 1px 2px rgba(20, 20, 20, 0.5);
            }

            .centered-room .door {
                width: 20px;
                height: 20px;
                background: #FFF;
                border-radius: 100%;
                position: absolute;
                box-shadow: 2px 2px 10px rgba(80, 20, 20, 0.5);
            }
            .centered-room.selected .door {
                background: #651FFF;
            }
            .centered-room .door.left {
                left: -18px;
                top: 25px;
            }
            .centered-room .door.right {
                right: -18px;
                top: 25px;
            }
            .centered-room .door.top {
                right: 50px;
                top: -18px;
            }
            .centered-room .door.bottom {
                right: 50px;
                bottom: -18px;
            }
        `
    }

    constructor() {
        super();

        this.minimap = game.rootScene.getMinimapData();
    }

    drawDoor(sideName) {
        return html`<div class="door ${sideName}"></div>`;
    }

    drawRoom(side) {
        if (this.minimap.currentRoom.side.has(side)) {
            const room = this.minimap.connectedRooms.get(side);
            console.log("room type: ", room.type, Minimap.Icons[room.type]);

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
                    <div class="centered-room selected">
                        <p>You are here!</p>
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
