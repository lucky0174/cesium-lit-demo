import { LitElement, html, css } from 'lit';

class WidgetIncDec extends LitElement {
  static properties = {
    cvar: {type: Object},
  };

  static styles = css`
    .widget {
      display: inline-flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      max-width: 300px; /* Set a maximum width */
      margin: 0 auto; /* Center the widget */
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
        <span>${this.cvar.name()}</span>&nbsp;
        <button @click="${this._dec}">-</button>&nbsp;
        <span class="value">${this.cvar.value()}</span>&nbsp;
        <button @click="${this._inc}">+</button>
      </div>
    `;
  }

  _inc() {
    this.cvar.inc();
    this.requestUpdate();
    this._emitChangeEvent();
  }

  _dec() {
    this.cvar.dec();
    this.requestUpdate();
    this._emitChangeEvent();
  }

  _emitChangeEvent() {
    console.log('change event emitted', this.cvar.value());
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {value: this.cvar.value()},
      })
    );
  }
}

customElements.define('widget-inc-dec', WidgetIncDec);
