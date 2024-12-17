import {LitElement, html, css} from 'lit';

/**
 * WidgetIncDec - A custom Lit element for incrementing and decrementing a value.
 * This widget displays a value with increment and decrement buttons.
 */
class WidgetIncDec extends LitElement {
  // Define the properties for this element
  static properties = {
    cvar: {type: Object},
    value: {type: String},
    _incrementing: {type: Boolean, state: true}, // Private state property
    _decrementing: {type: Boolean, state: true}, // Private state property
  };

  // Define the CSS styles for this element
  static styles = css`
    .widget {
      display: inline-flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 5px;
      max-width: 250px;
      margin: 0 auto;
      background-color: #f0f0f0;
    }
    .value {
      margin: 0 5px;
      font-family: monospace;
      font-size: 1.3em;
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

    button {
      padding: 2px 6px;
      margin: 0 2px;
      font-size: 1em;
      transition: background-color 0.3s;
    }

    button.green {
      background-color: #4caf50;
      color: white;
    }

    button.orange {
      background-color: #ff9800;
      color: white;
    }
  `;

  constructor() {
    super();
    this.cvar = null;
    this.done = true;
    this._incrementing = false;
    this._decrementing = false;
  }

  updated(changedProperties) {}

  actionDone() {
    this._incrementing = false;
    this._decrementing = false;
  }

  /**
   * Render the widget
   * @returns {TemplateResult} The HTML template for the widget
   */
  render() {
    return html`
      <div class="widget">
        <span>${this.cvar.name()}</span>&nbsp;
        <button
          @click="${this._dec}"
          class="${this._decrementing ? 'orange' : 'green'}">
          -</button
        >&nbsp;
        <span class="value">${this._formatValue(this.cvar.value())}</span>
        <button
          @click="${this._inc}"
          class="${this._incrementing ? 'orange' : 'green'}">
          +
        </button>
      </div>
    `;
  }

  /**
   * Format the value for display
   * @param {number} value - The value to format
   * @returns {string} The formatted value as a string
   */
  _formatValue(value) {
    if (typeof value !== 'number') {
      return value.toString().padStart(5, ' ');
    }

    const absValue = Math.abs(value);
    let formattedValue;

    if (Number.isInteger(value)) {
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

  /**
   * Increment the value
   * @private
   */
  _inc() {
    this._incrementing = true;
    this.cvar.inc();
    this.requestUpdate();
    this._emitChangeEvent();
  }

  /**
   * Decrement the value
   * @private
   */
  _dec() {
    this._decrementing = true;
    this.cvar.dec();
    this.requestUpdate();
    this._emitChangeEvent();
  }

  /**
   * Emit a change event with the new value
   * @private
   */
  _emitChangeEvent() {
    console.log('change event emitted', this.cvar.value());
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {value: this.cvar.value()},
      })
    );
  }
}

// Register the custom element
customElements.define('widget-inc-dec', WidgetIncDec);
