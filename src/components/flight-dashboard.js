import {LitElement, html} from 'lit-element';

import './cesium-viewer.js';

import {CvarLin} from './utils/cvars';
import './utils/widgets.js'; // Ensure the WidgetIncDec component is imported

const headingCvar = new CvarLin(0, 360, 0, 5, 'Heading');

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

export class FlightDashboard extends LitElement {
  static get properties() {
    return {
      cameraQuery: {
        type: Number,
      },
      currentPlace: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.cameraPlaces = getCameraPlaces();

    this.currentPlace = this.cameraPlaces[0];
    this.updateHeadingCvar(this.currentPlace.heading);
    this.cameraQuery = 0;
  }

  updateHeadingCvar(heading) {
    headingCvar.setValue(heading);
    this.requestUpdate();
  }

  // add listener for custom event "cmera-query" from child component
  firstUpdated() {
    this.addEventListener('camera-query', (e) => {
      this.currentPlace = {...e.detail};
    });
  }

  // In the updated method, modify the event listener for the widget
  updated(changedProperties) {
    super.updated(changedProperties);

    const widget = this.shadowRoot.querySelector('widget-inc-dec');
    if (widget) {
      widget.addEventListener('change', () => {
        this.currentPlace = {
          ...this.currentPlace,
          heading: headingCvar.value(),
        };
        this.requestUpdate();
        console.log('heading changed', this.currentPlace.heading);
      });
    }
  }

  // formatter for the camera coordinates

  stringifyPlace(place) {
    return JSON.stringify(place, (key, value) => {
      if (value.toFixed === undefined) return value;
      switch (key) {
        case 'lngDeg':
        case 'latDeg':
          return value.toFixed(6);
        case 'height':
        case 'heading':
        case 'pitch':
        case 'roll':
          return value.toFixed(0);
      }
    });
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

  _renderHeightAndQueryButtons = () => {
    return html`
      <fieldset>
        <legend>Height</legend>
        <button id="--" @click=${this._clickIncrementHeight} part="button">
          --
        </button>
        <button id="++" @click=${this._clickIncrementHeight} part="button">
          ++
        </button>
        &nbsp; ${(+this.currentPlace.height).toFixed(0)} m
        <p>
          <button id="?" @click=${this._clickCameraQuery} part="button">
            ?
          </button>
          <span>${this.stringifyPlace(this.currentPlace)}</span>
        </p>
        <p>
          <widget-inc-dec .cvar=${headingCvar}></widget-inc-dec>
        </p>
      </fieldset>
    `;
  };

  _renderCesiumViewer = () => {
    console.log('_renderCesiumViewer', this.currentPlace.heading);

    return html`
      <div style="border: 1px solid blue; ">
        <p>
          &nbsp;&lt;cesium-viewer&gt; &nbsp;&lt;/cesium-viewer&gt; instantiated
          in flight-dashboard.js
        </p>
        <cesium-viewer
          .cameraCoords=${this.currentPlace}
          .cameraQuery=${this.cameraQuery}
          @camera-query=${this._handleCameraQuery}>
        </cesium-viewer>
      </div>
    `;
  };

  render() {
    return html`
      <div style="border: 1px solid blue;  padding: 5px">
        ${this._renderRadioButtons()} ${this._renderHeightAndQueryButtons()}
        ${this._renderCesiumViewer()}
      </div>
    `;
  }

  // listeners

  _clickIncrementHeight(e) {
    const factor = e.target.id === '--' ? 0.5 : 2.0;
    const place = this.currentPlace;
    const height = +place.height * factor;
    place.height = clamp(height, 2000, 32_768_000);
    this.currentPlace = {...place};
    console.log(`FlightDashboard _clickIncrementHeight:`, height);
  }

  // Modify the _onChangePlace method to update headingCvar
  _onChangePlace(e) {
    const place = this.cameraPlaces.find(
      (place) => place.name === e.target.value
    );
    console.log('flight-dashboard _onChangePlace:', place);
    this.currentPlace = place;
    this.updateHeadingCvar(place.heading);
  }

  _clickCameraQuery(e) {
    // increment cameraQuery to trigger a readout of the camera position
    this.cameraQuery++;
  }

  // Modify the _handleCameraQuery method to update headingCvar
  _handleCameraQuery(event) {
    this.currentPlace = {...event.detail};
    this.updateHeadingCvar(this.currentPlace.heading);
    this.requestUpdate();
  }
}

function getCameraPlaces() {
  return [
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
      name: 'Ecublens',
      lngDeg: 6.56362,
      latDeg: 46.52474,
      height: 2000,
      heading: 0,
      pitch: -90,
      roll: 0,
    },
    {
      name: 'Grand Combin',
      lngDeg: 7.286978,
      latDeg: 46.02588,
      height: 3902,
      heading: 178,
      pitch: -5.294,
      roll: 0,
    },
    {
      name: 'Zermatt',
      lngDeg: 7.752989,
      latDeg: 46.017516,
      height: 2100,
      heading: 230,
      pitch: 10,
      roll: 0,
    },
    {
      name: 'Triglav',
      lngDeg: 13.83659,
      latDeg: 46.52829,
      height: 2100,
      heading: 180,
      pitch: 0,
      roll: 0,
    },
    {
      name: 'Osijek',
      lngDeg: 18.69389,
      latDeg: 45.55111,
      height: 10000,
      heading: 0,
      pitch: -90,
      roll: 0,
    },
    {
      name: 'Zagreb',
      lngDeg: 15.94798,
      latDeg: 45.79,
      height: 400,
      heading: 8,
      pitch: -10,
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

window.customElements.define('flight-dashboard', FlightDashboard);
