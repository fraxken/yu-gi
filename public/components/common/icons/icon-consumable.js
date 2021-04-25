const { LitElement, css, html } = require("lit-element");

class ConsumableIcon extends LitElement {
  static get properties() {
    return {
      width: { type: Number }
    }
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super()

    this.width = 15
  }

  render() {
    return html`<icon-base width=${this.width} src="../images/consumable.png"></icon-base>`;
  }
}

customElements.define("icon-consumable", ConsumableIcon);