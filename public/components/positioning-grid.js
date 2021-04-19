import { LitElement, css, html } from "lit-element";

class PositioningGrid extends LitElement {

    constructor() {
        super();
    }

    static get styles() {
        return css`
            .grid-container {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr 1fr;
                gap: 0px 0px;
                height: 100%;
                width: 100%;
            }
            .left-top {
                grid-area: 1 / 1 / 2 / 2;
            }
            .top {
                grid-area: 1 / 2 / 2 / 3;
                display: flex;
                justify-content: center;
            }
            .right-top {
                grid-area: 1 / 3 / 2 / 4;
                display: flex;
                justify-content: flex-end;
            }
            .left {
                grid-area: 2 / 1 / 3 / 2;
                display: flex;
                align-items: center;
            }
            .center {
                grid-area: 2 / 2 / 3 / 3;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .right {
                grid-area: 2 / 3 / 3 / 4;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .left-bottom {
                grid-area: 3 / 1 / 4 / 2;
                display: flex;
                align-items: flex-end;
            }
            .bottom {
                grid-area: 3 / 2 / 4 / 3;
                display: flex;
                align-items: flex-end;
                justify-content: center;
            }
            .right-bottom {
                 grid-area: 3 / 3 / 4 / 4;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
            }
        `;
    }

    render() {
        return html`
            <div class="grid-container">
                <div class="left-top">
                    <slot name=left-top></slot>
                </div>
                <div class="top">
                    <slot name=top></slot>
                </div>
                <div class="left">
                    <slot name=left></slot>
                </div>
                <div class="center">
                    <slot name=center></slot>
                </div>
                <div class="left-bottom">
                    <slot name=left-bottom></slot>
                </div>
                <div class="bottom">
                    <slot name=bottom></slot>
                </div>
                <div class="right-top">
                    <slot name=right-top></slot>
                </div>
                <div class="right">
                    <slot name=right></slot>
                </div>
                <div class="right-bottom">
                    <slot name=right-bottom></slot>
                </div>
            </div>
        `;
    }
}

customElements.define("positioning-grid", PositioningGrid);
