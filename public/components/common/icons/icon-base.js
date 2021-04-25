const { LitElement, css, html } = require("lit-element");

class BaseIcon extends LitElement {
  static get properties() {
    return {
      width: { type: Number },
      src: { type: String }
    }
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super()

    this.width = 15
    this.src = "../images/star.png"
  }

  render() {
    return html`<img width=${this.width} src=${this.src}/>`;
  }
}

customElements.define("icon-base", BaseIcon);