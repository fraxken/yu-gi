import { LitElement, css, html } from 'lit-element'

class CardDetail extends LitElement {
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
          ? this.renderCardDetailFallback()
          : this.renderCardDetail()
        }
      </div>
    `;
  }

  renderCardDetail() {
    const {
      name,
      description,
      offensiveSkill,
      defensiveSkill,
      passiveSkill,
      consumableSkill,
      stars
     } = this.product;

    return html`
      <div>
        <h2 class="title-detail">Detail of ${name}</h2>
        <p>${description}</p>
        <h4>Skills</h4>
        <ul>
          <li>Offense: ${offensiveSkill}</li>
          <li>Defense: ${defensiveSkill}</li>
          <li>Passive: ${passiveSkill}</li>
          <li>Consumable: ${consumableSkill}</li>
        </ul>
        <h4>Stars: ${stars}</h4>
        <button
          @click=${() => alert('Gimme the loot !')}
          class="buy-button"
        >Buy</button>
      </div>
    `;
  }

  renderCardDetailFallback() {
    return html`Please select a product.`;
  }
}

customElements.define('card-detail', CardDetail);