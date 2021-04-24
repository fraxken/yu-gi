import { LitElement, css, html } from 'lit-element'

class ProductDetail extends LitElement {
  static get properties() {
    return {
      product: { type: Object }
    }
  }

  static get styles() {
    return css`
      .title-detail {
        margin: 0;
        margin-bottom: 10px;
      }

      .buy-button{
        text-align: center; 
        display: inline-block;
        margin: 5px;
        font-weight: bold;
        padding: 10px 10px 10px 10px ;
        background-color: lightgray;
        border-radius: 7px;
        box-shadow: 0 .2em gray; 
        cursor: pointer;
      }
    `;
  }

  render() {
    const shouldRenderFallBack = this.product === null || this.product === undefined

    return html`
      <div>
        ${shouldRenderFallBack
          ? this.renderProductDetailFallback()
          : this.renderProductDetail()
        }
      </div>
    `;
  }

  renderProductDetail() {
    const { name, description } = this.product;

    return html`
      <div>
        <h2 class="title-detail">Detail of ${name}</h2>
        <p>${description}</p>
        <button
          @click=${() => alert('Gimme the loot !')}
          class="buy-button"
        >Buy</button>
      </div>
    `;
  }

  renderProductDetailFallback() {
    return html`Please select a product.`;
  }
}

customElements.define('product-detail', ProductDetail);