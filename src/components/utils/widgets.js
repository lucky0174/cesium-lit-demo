import { LitElement, html, css } from 'lit';
import { CvarLin } from '../cvars/cvars';
import { CvarLog } from '../cvars/cvars';

class WidgetIncDec extends LitElement {
    static properties = {
        cvar: { type: Object }
    };

    static styles = css`
        .widget {
            display: flex;
            align-items: center;
        }
        .value {
            margin: 0 10px;
        }
    `;

    constructor() {
        super();
        this.cvar = null;
    }

    render() {
        return html`
            <div class="widget">
                <span>${this.cvar.name()}</span>
                <button @click="${this._dec}">-</button>
                <span class="value">${this.cvar.value()}</span>
                <button @click="${this._inc}">+</button>
            </div>
        `;
    }

    _inc() {
        this.cvar.inc();
        this.requestUpdate();
    }

    _dec() {
        this.cvar.dec();
        this.requestUpdate();
    }
}

customElements.define('widget-inc-dec', WidgetIncDec);
