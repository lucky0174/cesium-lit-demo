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
      padding: 5px;
      max-width: 250px;
      margin: 0 auto;
    }
    .value {
      margin: 0 5px;
      font-family: monospace;
      font-size: 1.2em;
      min-width: 60px;
      text-align: right;
    }
    button {
      padding: 2px 6px;
      margin: 0 2px;
      font-size: 1em;
    }
    .name {
      margin-right: 5px;
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
        <span class="value">${this._formatValue(this.cvar.value())}</span>
        <button @click="${this._inc}">+</button>
      </div>
    `;
  }

  _formatValue(value) {
    if (typeof value !== 'number') {
      return value.toString().padStart(5, ' ');
    }

    const absValue = Math.abs(value);
    let formattedValue;

    if (absValue >= 10000 || (absValue < 0.001 && absValue !== 0)) {
      // Use scientific notation for very large or very small numbers
      formattedValue = value.toExponential(2);
    } else if (Number.isInteger(value)) {
      // For integers, use fixed-point notation
      formattedValue = value.toFixed(0);
    } else {
      // For other numbers, use a maximum of 5 significant digits
      const precision = Math.min(
        4,
        Math.max(0, 4 - Math.floor(Math.log10(absValue)))
      );
      formattedValue = value.toFixed(precision);
    }

    // Ensure the string is exactly 5 characters long
    return formattedValue.padStart(5, ' ');
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
