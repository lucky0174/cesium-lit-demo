import {LitElement, html} from 'lit-element';
import {customElement, property, state} from 'lit/decorators.js';

import './cesium-viewer.js';

/**
 * Clamp the value to the range [min, max].
 * @param {*} value
 * @param {*} min
 * @param {*} max
 * @returns -- clamped value
 */
const clamp = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

class TestElement extends LitElement {
  static get properties() {
    return {
      countries: {
        type: Array,
      },
    };
  }

  constructor() {
    super();

    this.config = {
      id: 'configuration',
      options: ['', 'homeButton', 'helpButton', 'homeButton helpButton'],
    };
  }

  // https://stackoverflow.com/questions/55859715/how-to-set-checked-attribute-to-radio-in-litelement

  // todo: add event listener to radio buttons

  radiobuttonstring = ``;

  onChange(e) {
    console.log('ttt onChange e.target.value:', e.target.value);

    // set radiobuttonstring to the selected radio button value
    this.radiobuttonstring = e.target.value;
    this.requestUpdate();
  }

  @state()
  height = 800000;

  setHeight(height) {
    this.height = clamp(height, 1000, 32_768_000);
    // this.requestUpdate();
  }

  render() {
    const homeButton = this.radiobuttonstring.includes('homeButton');
    const helpButton = this.radiobuttonstring.includes('helpButton');
    console.log(
      `ttt render this.radiobuttonstring:`,
      this.radiobuttonstring,
      homeButton,
      helpButton,
      this.height
    );

    const config = this.config;
    return html`
      <fieldset>
        <legend>${config.id}</legend>
        <form>
          ${config.options.map(
            (option) => html`
              <input
                id="provider-send-${option}"
                name="sending-${config.id}"
                type="radio"
                class="form-check-input"
                value="${option}"
                ?checked=${option === this.config.options[0]}
                @change=${this.onChange} />
              <label class="form-check-label">${option}</label>
              <br />
            `
          )}
        </form>
      </fieldset>
      <fieldset>
        <button id="--" @click=${this._onClick} part="button">--</button>
        <button id="++" @click=${this._onClick} part="button">++</button>
        &nbsp; height: ${this.height} m
      </fieldset>
      <div
        style="border: 1px solid blue; width: 90%;">
        <p>instantiated in test-element.js</p>
        <cesium-viewer
          ?homeButton=${homeButton}
          ?helpButton=${helpButton}
          .height=${this.height}>
        </cesium-viewer>
      </div>
    `;
  }

  _onClick(e) {
    const factor = e.target.id === '--' ? 0.5 : 2.0;
    this.setHeight(this.height * factor);
  }
}

customElements.define('test-element', TestElement);
