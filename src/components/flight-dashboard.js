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

    // data for the child component

    this.cameraPlaces = [
      {
        name: 'Geneva',
        lngDeg: 6.15444444,
        latDeg: 46.20555556,
        height: 10000,
        heading: 0,
        pitch: -90,
        roll: 0,
      },
      {
        name: 'Zermatt',
        lngDeg: 7.73888889,
        latDeg: 46.02055556,
        height: 2200,
        heading: 230,
        pitch: 10,
        roll: 0,
      },
      {
        name: 'Philadelphia',
        lngDeg: -75.165222,
        latDeg: 39.952583,
        height: 20000,
        heading: 0,
        pitch: -90,
        roll: 0,
      },
    ];
  }

  @state()
  selectedPlace = {};

  @state()
  height = 800000;

  setHeight(height) {
    this.height = clamp(height, 1000, 32_768_000);
  }

  // render fragments and render

  _renderRadioButtons = () => {
    return html`
      <fieldset>
        <legend>Fly and see</legend>
        <form>
          ${this.cameraPlaces.map(
            (option) => html`
              <input
                id="provider-send-${option.name}"
                name="radio-name"
                type="radio"
                class="form-check-input"
                value="${option.name}"
                ?checked=${option.name === this.cameraPlaces[0].name}
                @change=${this._onChangePlace} />
              <label class="form-check-label">${JSON.stringify(option)}</label>
              <br />
            `
          )}
        </form>
      </fieldset>
    `;
  };

  _renderButtons = () => {
    return html`
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
    `;
  };

  _renderCesiumViewer = () => {
    return html`
      <div style="border: 1px solid blue; ">
        <p>
          &nbsp;&lt;cesium-viewer&gt; &nbsp;&lt;/cesium-viewer&gt; instantiated
          in flight-dashboard.js
        </p>
        <cesium-viewer
          .height=${this.height}
          .cameraCoords=${this.selectedPlace}></cesium-viewer>
      </div>
    `;
  };

  render() {
    console.log('flight-dashboard render', this.selectedPlace);

    return html`
      <div style="border: 1px solid blue;  padding: 5px">
        ${this._renderRadioButtons()} ${this._renderButtons()}
        ${this._renderCesiumViewer()}
      </div>
    `;
  }

  // listeners

  _clickIncrementHeight(e) {
    // select Geneva if not selected
    if (this.selectedPlace.name !== this.cameraPlaces[0].name) {
      this.selectedPlace = this.cameraPlaces[0];
    }
    const factor = e.target.id === '--' ? 0.5 : 2.0;
    this.setHeight(this.height * factor);
  }

  _onChangePlace(e) {
    const place = this.cameraPlaces.find(
      (place) => place.name === e.target.value
    );
    console.log('flight-dashboard _onChangePlace:', place);
    this.selectedPlace = place;
  }
}
