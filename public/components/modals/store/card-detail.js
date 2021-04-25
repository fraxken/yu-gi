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
        background-color: burlywood;
        border-radius: 7px;
        box-shadow: 0 .2em gray; 
        cursor: pointer;
      }
      
      .skills {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .skill-item {
        background-color: #37474F;
        border-radius: 10px;
        margin: 10px;
        height: 40px;
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: space-around;
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
        <h2 class="title-detail">
          Detail of ${name}
          ${(new Array(stars).fill(1)).map(() => html`<icon-star></icon-star>`)}
        </h2>
        <p>${description}</p>
        <h4>Skills</h4>
        <div class="skills">
          <div class="skill-item" title="Offense"><icon-offense width=${30}></icon-offense><div>${offensiveSkill}</div></div>
          <div class="skill-item" title="Defense"><icon-defense width=${30}></icon-defense><div>${defensiveSkill}</div></div>
          <div class="skill-item" title="Passive"><icon-passive width=${30}></icon-passive><div>${passiveSkill}</div></div>
          <div class="skill-item" title="Consumable"><icon-consumable width=${30}></icon-consumable><div>${consumableSkill}</div></div>
        </div>
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