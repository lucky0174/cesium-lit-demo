/** @prettier */

import {html, css, unsafeCSS, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import * as Cesium from 'cesium';

// This works, tested in dev and in build+preview
import widgetStylesRaw from 'cesium/Build/Cesium/Widgets/widgets.css';
const widgetStyles = css`
  ${unsafeCSS(widgetStylesRaw)}
`;

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from the cesiumjs-quickstart demo
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDY5YjNjNy05ZDZjLTQ5YjUtODBhOC03MGY4Njc3MzUyMDEiLCJpZCI6MTEyNTc3LCJpYXQiOjE2NjY4MTYyNjB9.fd9TA4pMsDaKBWE1lSEBvYB34xR-R1anLfSG-vSVI4c';

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

/**
 * Camera position and orientation to fly to.
 * @requires -- a `viewer` object.
 */
class CameraCoordinates {
  constructor() {
    this.lngDeg = 6.14569;
    this.latDeg = 46.20222;
    this.height = 200000;
    this.heading = 0.0;
    this.pitch = -90.0;
    this.roll = 0.0;
  }

  setHeight(height) {
    this.height = clamp(height, 1000, 40_000_000);
  }

  flyTo(viewer) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        this.lngDeg,
        this.latDeg,
        this.height
      ),
      orientation: {
        heading: Cesium.Math.toRadians(this.heading),
        pitch: Cesium.Math.toRadians(this.pitch),
        roll: Cesium.Math.toRadians(this.roll),
      },
    });
  }
}

/**
 * Encapsulation of Cesium Viewer and custom controls.
 */
@customElement('cesium-lit')
export class CesiumLit extends LitElement {
  static get styles() {
    return [
      widgetStyles,
      css`
      :host {
        display: block; /* no effect */
        padding: 10px;
        max-width: 100vw;
        max-height: 100vw; /*no effect*/
        font-size: 16px;
        font-family: Helvetica, Arial, sans-serif;
        /* box-sizing: content-box; no effect */
      }
      button {
        font-size: 14px;
      }
      #cesiumContainer {
        /* width: 50%; */
        /* width: 100%; */
        /* height: 100%; */ /*does not prevent vertical growth*/
        /* max-width: 100vw; */
        /* max-height: 100vh; prevents vertical growth, vertically incluses all widgets */
        /* width: auto; */
        /* height: auto; */
        /* height: 700px;*/ /*prevents vertical growth */
        background: thistle;
        /* overflow: hidden; not needed */
        border: solid 1px blue;
      }
      .lit-widgets {
        background: hsl(0, 0%, 90%);
        border: solid 1px blue;
        padding: 10px;
      }
    `,
    ];
  }

  @property() name = 'Cesium';

  cameraCoordinates = new CameraCoordinates();

  flyTo() {
    this.cameraCoordinates.flyTo(this.viewer);
  }

  firstUpdated() {
    const cesiumContainer = this.renderRoot.getElementById('cesiumContainer');
    console.log(`firstUpdated cesiumContainer:`, cesiumContainer);
    this.viewer = new Cesium.Viewer(cesiumContainer, {
      terrainProvider: Cesium.createWorldTerrain(),
    });
    this.flyTo();
  }

  render() {
    return html`
      <div class="lit-widgets">
        <h3>Hello, ${this.name}!</h3>
        <button id="--" @click=${this._onClick} part="button">--</button>
        <button id="++" @click=${this._onClick} part="button">++</button>
        &nbsp; height: ${this.cameraCoordinates.height} m
      </div>
      <div id="cesiumContainer"></div>
    `;
  }

  _onClick(e) {
    const factor = e.target.id === '--' ? 0.5 : 2.0;
    this.cameraCoordinates.setHeight(this.cameraCoordinates.height * factor);
    this.flyTo();
    this.requestUpdate();
  }
}
