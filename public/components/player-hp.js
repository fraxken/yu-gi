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
      .life-bar {
        padding: 2px;
        margin: 4px;
        background-color: white;
        border: 1px grey solid;
        height: 30px;
        border-radius: 3px 30px 6px 12px;
        width: 300px;
        position: relative;
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
       .resources {
           margin-left: 16px;
           color: #e8d052;
           font-weight: bold;
           text-shadow: 1px 1px 1px #747474;
       }
     `;
    }

    render() {
        const lifePercent = (this.currentHp / this.maxHp) * 100;

        return html`
        <div class="life-bar">
          <div class="current-life" style="width: ${lifePercent}% "></div>
        </div>
        <span class="name">${this.gold}</span>
        <!-- <span class="resources">10525541</span> -->
    `;
    }
}

customElements.define("player-hp", PlayerHp);
