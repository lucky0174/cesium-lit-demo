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

@customElement('flight-dashboard')
class FlightDashboard extends LitElement {
  static get properties() {
    return {
      countries: {
        type: Array,
      },
    };
  }

  constructor() {
    super();

    const geneva = JSON.stringify({
      lngDeg: 6.15444444,
      latDeg: 46.20555556,
      height: 10000,
      pitch: -90,
    });
    const zermatt = JSON.stringify({
      lngDeg: 7.74912,
      latDeg: 46.02126,
      height: 2200,
      heading: 230,
      pitch: 10,
    });
    const philadelphia = JSON.stringify({
      lngDeg: -75.165222,
      latDeg: 39.952583,
      height: 20000,
      pitch: -90,
    });

    this.config = {
      id: 'configuration',
      options: [geneva, zermatt, philadelphia],
    };
  }

  radiobuttonstring = `{}`; // valid JSON

  onChangeConfig(e) {
    console.log('flight-dashboard onChange e.target.value:', e.target.value);

    // set radiobuttonstring to the selected radio button value
    this.radiobuttonstring = e.target.value;
    this.requestUpdate();
  }

  @state()
  height = 800000;

  setHeight(height) {
    this.height = clamp(height, 1000, 32_768_000);
    this.radiobuttonstring = this.config.options[0]; // geneva
  }

  render() {
    const homeButton = this.radiobuttonstring.includes('homeButton');
    const helpButton = this.radiobuttonstring.includes('helpButton');
    const camCoords = this.radiobuttonstring;

    console.log(
      `flight-dashboard render.`,
      this.radiobuttonstring,
      homeButton,
      helpButton,
      this.height
    );

    const config = this.config;
    return html`
      <div style="border: 1px solid blue;  padding: 5px">
        <fieldset>
          <legend>Fly and see</legend>
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
                  @change=${this.onChangeConfig} />
                <label class="form-check-label">${option}</label>
                <br />
              `
            )}
          </form>
        </fieldset>
        <fieldset>
          <legend>Geneva</legend>
          <button id="--" @click=${this._clickIncrementHeight} part="button">
            --
          </button>
          <button id="++" @click=${this._clickIncrementHeight} part="button">
            ++
          </button>
          &nbsp; height: ${this.height} m
        </fieldset>
        <div style="border: 1px solid blue; ">
          <p>
            &nbsp;&lt;cesium-viewer&gt; &nbsp;&lt;/cesium-viewer&gt;
            instantiated in flight-dashboard.js
          </p>
          <cesium-viewer
            .height=${this.height}
            .cameraCoordinatesJson=${camCoords}>
          </cesium-viewer>
        </div>
      </div>
    `;
  }

  _clickIncrementHeight(e) {
    const factor = e.target.id === '--' ? 0.5 : 2.0;
    this.setHeight(this.height * factor);
  }
}
