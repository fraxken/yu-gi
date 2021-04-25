const { LitElement, css, html } = require("lit-element");

class StarIcon extends LitElement {
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
    return html`<icon-base width=${this.width} src="../images/star.png"></icon-base>`;
  }
}

customElements.define("icon-star", StarIcon);