import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../helpers";

class PlayerHp extends LitElement {
    // static get properties() {
    //   return {};
    // }

    constructor() {
        super();
        bindToScriptEvent(this, "player.currentHp", "currentHp");
        bindToScriptEvent(this, "player.gold", "gold");
        bindToScriptEvent(this, "player.maxHp", "maxHp");
    }

    static get styles() {
        return css`
          .player-hp {
            display: flex;
            align-items: center;
            margin-top: 20px;
            margin-left: 20px;
          }

          .gold-wrapper {
            z-index: 2;
          }

          .life-bar {
            padding: 2px;
            margin: 4px;
            margin-left: -12px;
            background-color: white;
            height: 30px;
            border-radius: 3px 30px 6px 12px;
            width: 300px;
            position: relative;
            box-shadow: 0 0 0 2px #8E9397 inset;
          }

          .current-life {
            height: 100%;
            border-radius: 3px 108px 12px 41px;
            background: linear-gradient(191deg, rgba(255,99,99,1) 0%, rgba(215,0,0,1) 35%, rgba(74,32,32,1) 100%);
          }
          .name {
              background: grey;
              color: white;
              border-radius: 4px;
              padding: 4px 8px;
              margin-left: 20px;
              font-weight: bold;
              font-variant: small-caps;
          }
          .gold {
            font: "Roboto";
            font-size: 13px;
            color: white;
            font-weight: bold;
            position: absolute;
            top: 52px;
            left: 30px;
          }
        `;
    }

    render() {
        const lifePercent = (this.currentHp / this.maxHp) * 100;

        return html`
        <div class="player-hp">
          <div class="gold-wrapper">
            <div class="gold">${this.gold}</div>
            <img width=${50} src="../images/bg-monnaie.png"/>
          </div>
          <div class="life-bar">
            <div class="current-life" style="width: ${lifePercent}% "></div>
          </div>
        </div>
    `;
    }
}

customElements.define("player-hp", PlayerHp);
