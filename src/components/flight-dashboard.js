import {LitElement, html} from 'lit-element';

import './cesium-viewer.js';

import {CvarLin, CvarLinWrap, CvarLog} from './utils/cvars';
import './utils/widgets.js'; // Ensure the WidgetIncDec component is imported

// Define Cvar instances for each camera parameter
const lngCvar = new CvarLinWrap(-180, 180, 0, 0.01, 'Longitude');
const latCvar = new CvarLin(-90, 90, 0, 0.01, 'Latitude');
const heightCvar = new CvarLog(200, 4096000, 2000, 1.5, 'Height');
const headingCvar = new CvarLinWrap(0, 360, 0, 5, 'Heading');
const pitchCvar = new CvarLin(-90, 90, 0, 5, 'Pitch');

/**
 * @class FlightDashboard
 * @extends {LitElement}
 * @description A custom element that provides a dashboard for controlling a Cesium viewer's camera.
 * It allows users to select predefined places, adjust camera parameters, and interact with a Cesium viewer.
 *
 * @property {Number} cameraQuery - A trigger for querying the camera's current position.
 * @property {Object} currentPlace - The currently selected or set place, containing camera coordinates and settings.
 *
 * @listens camera-coords - Listens for camera position updates from the Cesium viewer.
 */
export class FlightDashboard extends LitElement {
  // Define properties for the component
  static get properties() {
    return {
      cameraQuery: {
        type: Number,
      },
      currentPlace: {
        type: Object,
      },
      _cameraMoving: {type: Boolean, state: true},
    };
  }

  constructor() {
    super();
    // Initialize component state
    this.cameraPlaces = getCameraPlaces();
    this.currentPlace = this.cameraPlaces[0];
    this._cameraMoving = false;

    // Set initial values for Cvars
    this._updateAllCvars();
  }

  // Update all Cvars based on currentPlace and its keys
  _updateAllCvars() {
    const cvars = [
      {cvar: lngCvar, key: 'lngDeg'},
      {cvar: latCvar, key: 'latDeg'},
      {cvar: heightCvar, key: 'height'},
      {cvar: headingCvar, key: 'heading'},
      {cvar: pitchCvar, key: 'pitch'},
    ];
    cvars.forEach(({cvar, key}) => cvar.setValue(this.currentPlace[key]));
    this.requestUpdate();
  }

  // Lifecycle method: called after first render
  firstUpdated() {
    // Define widget configurations
    const widgets = [
      {id: 'lng-widget', key: 'lngDeg', cvar: lngCvar},
      {id: 'lat-widget', key: 'latDeg', cvar: latCvar},
      {id: 'height-widget', key: 'height', cvar: heightCvar},
      {id: 'heading-widget', key: 'heading', cvar: headingCvar},
      {id: 'pitch-widget', key: 'pitch', cvar: pitchCvar},
    ];

    // Helper function to update currentPlace and trigger re-render
    const updatePlace = (key, value) => {
      this.currentPlace = {
        ...this.currentPlace,
        [key]: value,
      };
      //  console.log(`${key} changed`, this.currentPlace[key]);
    };

    // Add event listeners to widgets
    widgets.forEach(({id, key, cvar}) => {
      const widget = this.shadowRoot.querySelector(`#${id}`);
      if (widget) {
        widget.addEventListener('change', () => {
          updatePlace(key, cvar.value());
          console.log(`updated ${key}`);
        });
      }
    });
  }

  // Lifecycle method: called after each update
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('_cameraMoving') && this._cameraMoving) {
      // Reset _cameraMoving to false after passing it to the widgets
      this._cameraMoving = false;
    }
  }

  // Render methods

  // Render radio buttons for place selection
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
              <label class="form-check-label">${option.name}</label>
              <br />
            `
          )}
        </form>
      </fieldset>
    `;
  };

  // Render camera control widgets
  _renderCameraControlWidgets = () => {
    // console.log('_renderCameraControlWidgets', this.currentPlace);
    const name = this.currentPlace.name;
    return html`
      <fieldset>
        <legend>Camera Controls</legend>
        <div>
          <widget-inc-dec
            id="lng-widget"
            .cvar=${lngCvar}
            value=${lngCvar.value()}></widget-inc-dec>

          <widget-inc-dec
            id="lat-widget"
            .cvar=${latCvar}
            value=${latCvar.value()}>
          </widget-inc-dec>

          <widget-inc-dec
            id="height-widget"
            .cvar=${heightCvar}
            value=${heightCvar.value()}></widget-inc-dec>

          <widget-inc-dec
            id="heading-widget"
            .cvar=${headingCvar}
            value=${headingCvar.value()}></widget-inc-dec>

          <widget-inc-dec
            id="pitch-widget"
            .cvar=${pitchCvar}
            value=${pitchCvar.value()}></widget-inc-dec>
        </div>
        <p>
          <span>${this._renderCoordinates(this.currentPlace)}</span>
        </p>
      </fieldset>
    `;
  };

  // Render the camera coordinates
  _renderCoordinates(place) {
    // replace 'name' with the actual place name
    let {name, ...coords} = place;
    coords = {[name]: '', ...coords};
    let maxKeyLength = Math.max(
      ...Object.keys(coords).map((key) => key.length)
    );
    maxKeyLength = Math.max(maxKeyLength, name.length);

    const formattedCoords = Object.entries(coords).map(
      ([key, value], index) => {
        let formattedValue = value;
        if (typeof value === 'number') {
          switch (key) {
            case 'lngDeg':
            case 'latDeg':
              formattedValue = value.toFixed(6);
              break;
            case 'height':
            case 'heading':
            case 'pitch':
            case 'roll':
              formattedValue = value.toFixed(0);
              break;
          }
        }
        const paddedKey = key.padStart(maxKeyLength, '\u00A0');
        if (index === 0) {
          return html`<div><strong>${paddedKey}</strong></div>`;
        }
        return html`<div>${paddedKey} : ${formattedValue}</div>`;
      }
    );
    return html`
      <div style="font-family: monospace; font-size: 1.4em; white-space: pre;">
        ${formattedCoords}
      </div>
    `;
  }

  // Render Cesium viewer component
  _renderCesiumViewer = () => {
    // console.log('_renderCesiumViewer', this.currentPlace.heading);

    return html`
      <div style="border: 1px solid blue; ">
        <p>
          &nbsp;&lt;cesium-viewer&gt; &nbsp;&lt;/cesium-viewer&gt; instantiated
          in flight-dashboard.js
        </p>
        <cesium-viewer
          .cameraCoords=${this.currentPlace}
          @camera-coords=${this._handleCameraStopped}>
        </cesium-viewer>
      </div>
    `;
  };

  // Main render method
  render() {
    return html`
      <div style="border: 1px solid blue;  padding: 5px">
        ${this._renderRadioButtons()} ${this._renderCameraControlWidgets()}
        ${this._renderCesiumViewer()}
      </div>
    `;
  }

  // Event handlers

  // Handle place change from radio buttons
  _onChangePlace(e) {
    const place = this.cameraPlaces.find(
      (place) => place.name === e.target.value
    );
    this.currentPlace = {...place};
    this._updateAllCvars();
  }

  // Handle camera-coords event from Cesium viewer
  _handleCameraStopped(event) {
    console.log('_handleCameraStopped', event.detail);
    const {name} = this.currentPlace;
    this.currentPlace = {
      name,
      ...event.detail,
    };
    this._cameraMoving = false;
    this._updateAllCvars(); // calls  this.requestUpdate();
  }
}

// Helper function to get predefined camera places
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
