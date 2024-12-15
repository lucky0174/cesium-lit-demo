import {LitElement, html} from 'lit-element';

import './cesium-viewer.js';

import {CvarLin, CvarLinWrap, CvarLog} from './utils/cvars';
import './utils/widgets.js'; // Ensure the WidgetIncDec component is imported

// Define Cvar instances for each camera parameter
const lngCvar = new CvarLinWrap(-180, 180, 0, 0.01, 'Longitude');
const latCvar = new CvarLin(-90, 90, 0, 0.01, 'Latitude');
const heightCvar = new CvarLog(2000, 4096000, 2000, 1.5, 'Height');
const headingCvar = new CvarLinWrap(0, 360, 0, 5, 'Heading');
const pitchCvar = new CvarLin(-90, 90, 0, 5, 'Pitch');

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
    };
  }

  constructor() {
    super();
    // Initialize component state
    this.cameraPlaces = getCameraPlaces();
    this.currentPlace = this.cameraPlaces[0];
    // Set initial values for Cvars
    this.updateCvar(lngCvar, this.currentPlace.lngDeg);
    this.updateCvar(latCvar, this.currentPlace.latDeg);
    this.updateCvar(heightCvar, this.currentPlace.height);
    this.updateCvar(headingCvar, this.currentPlace.heading);
    this.updateCvar(pitchCvar, this.currentPlace.pitch);

    this.cameraQuery = 0;
  }

  // Helper method to update Cvar and trigger re-render
  updateCvar(cvar, value) {
    cvar.setValue(value);
    this.requestUpdate();
  }

  // Lifecycle method: called after first render
  firstUpdated() {
    // Add listener for custom 'camera-query' event from child component
    this.addEventListener('camera-query', (e) => {
      const {name} = this.currentPlace;
      this.currentPlace = {
        name,
        ...e.detail,
      };
    });
  }

  // Lifecycle method: called after each update
  updated(changedProperties) {
    super.updated(changedProperties);

    // Helper function to update currentPlace and trigger re-render
    const updatePlace = (key, value) => {
      this.currentPlace = {
        ...this.currentPlace,
        [key]: value,
      };
      this.requestUpdate();
      console.log(`${key} changed`, this.currentPlace[key]);
    };

    // Define widget configurations
    const widgets = [
      {id: 'lng-widget', key: 'lngDeg', cvar: lngCvar},
      {id: 'lat-widget', key: 'latDeg', cvar: latCvar},
      {id: 'height-widget', key: 'height', cvar: heightCvar},
      {id: 'heading-widget', key: 'heading', cvar: headingCvar},
      {id: 'pitch-widget', key: 'pitch', cvar: pitchCvar},
    ];

    // Add event listeners to widgets
    widgets.forEach(({id, key, cvar}) => {
      const widget = this.shadowRoot.querySelector(`#${id}`);
      if (widget) {
        widget.addEventListener('change', () => {
          updatePlace(key, cvar.value());
        });
      }
    });
  }

  // Formatter for the camera coordinates
  stringifyPlace(place) {
    const {name, ...coords} = place;
    return `${name}: ${JSON.stringify(coords, (key, value) => {
      if (value.toFixed === undefined) {
        return value;
      }
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
    })}`;
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
              <label class="form-check-label">${JSON.stringify(option)}</label>
              <br />
            `
          )}
        </form>
      </fieldset>
    `;
  };

  // Render camera control widgets
  _renderHeightAndQueryButtons = () => {
    return html`
      <fieldset>
        <legend>Camera Controls</legend>
        <div style="display: flex; flex-wrap: wrap; gap: 5px 10px;">
          <widget-inc-dec id="lng-widget" .cvar=${lngCvar}></widget-inc-dec>
          <widget-inc-dec id="lat-widget" .cvar=${latCvar}></widget-inc-dec>
          <widget-inc-dec
            id="height-widget"
            .cvar=${heightCvar}></widget-inc-dec>
          <widget-inc-dec
            id="heading-widget"
            .cvar=${headingCvar}></widget-inc-dec>
          <widget-inc-dec id="pitch-widget" .cvar=${pitchCvar}></widget-inc-dec>
        </div>
        <p>
          <span>${this.stringifyPlace(this.currentPlace)}</span>
        </p>
      </fieldset>
    `;
  };

  // Render Cesium viewer component
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

  // Main render method
  render() {
    return html`
      <div style="border: 1px solid blue;  padding: 5px">
        ${this._renderRadioButtons()} ${this._renderHeightAndQueryButtons()}
        ${this._renderCesiumViewer()}
      </div>
    `;
  }

  // Event handlers

  // Handle place change from radio buttons
  _onChangePlace(e) {
    const place = this.cameraPlaces.find(place => place.name === e.target.value);
    console.log('flight-dashboard _onChangePlace:', place);
    this.currentPlace = {...place};
    this._updateAllCvars();
    this.requestUpdate();
  }

  // Handle camera query event from Cesium viewer
  _handleCameraQuery(event) {
    const {name} = this.currentPlace;
    this.currentPlace = {
      name,
      ...event.detail,
    };
    this._updateAllCvars();
    this.requestUpdate();
  }

  // Update all Cvars based on current place
  _updateAllCvars() {
    const cvars = [
      {cvar: lngCvar, key: 'lngDeg'},
      {cvar: latCvar, key: 'latDeg'},
      {cvar: heightCvar, key: 'height'},
      {cvar: headingCvar, key: 'heading'},
      {cvar: pitchCvar, key: 'pitch'},
    ];
    cvars.forEach(({cvar, key}) => this.updateCvar(cvar, this.currentPlace[key]));
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
