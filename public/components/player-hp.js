import { LitElement, css, html } from "lit-element";

import { bindToScriptEvent } from "../helpers";

class PlayerHp extends LitElement {
    // static get properties() {
    //   return {};
    // }

    constructor() {
        super();
        bindToScriptEvent(this, "player.currentHp", "currentHp");
        bindToScriptEvent(this, "player.maxHp", "maxHp");
    }

    static get styles() {
        return css`
      .life-bar {
        padding: 2px;
        margin: 4px;
        background-color: white;
        border: 1px grey solid;
        height: 20px;
        border-radius: 3px;
        width: 200px;
       }

      .current-life {
        height: 100%;
        background-color: red;
       }

       .info-life {
         position: absolute;
         color: white;
         height: 20px;
         padding: inherit;
       }
     `;
    }

    render() {
        const lifePercent = (this.currentHp / this.maxHp) * 100;

        return html`
        <div class="life-bar">
          <span class="info-life">${lifePercent} %</span>
          <div class="current-life" style="width: ${lifePercent}% "/>
        </div>
    `;
    }
}

customElements.define("player-hp", PlayerHp);
