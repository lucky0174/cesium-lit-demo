/** @prettier */

import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

// code from https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDY5YjNjNy05ZDZjLTQ5YjUtODBhOC03MGY4Njc3MzUyMDEiLCJpZCI6MTEyNTc3LCJpYXQiOjE2NjY4MTYyNjB9.fd9TA4pMsDaKBWE1lSEBvYB34xR-R1anLfSG-vSVI4c';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain(),
});
// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = viewer.scene.primitives.add(
  Cesium.createOsmBuildings()
);
// Fly the camera to San Francisco at the given longitude, latitude, and height.
// viewer.camera.flyTo({
//   destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
//   orientation : {
//     heading : Cesium.Math.toRadians(0.0),
//     pitch : Cesium.Math.toRadians(-15.0),
//   }
// });

// Genève 46.20222, 6.14569
// viewer.camera.flyTo({
//   destination: Cesium.Cartesian3.fromDegrees(6.14569, 46.20222, 200000),
//   orientation: {
//     heading: Cesium.Math.toRadians(0.0),
//     pitch: Cesium.Math.toRadians(-90.0),
//   },
// });

const clamp = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

class CameraPositionAndOrientation {
  constructor() {
    this.lngDeg = 6.14569;
    this.latDeg = 46.20222;
    this.height = 200000;
    this.heading = 0.0;
    this.pitch = -90.0;
    this.roll = 0.0;
    console.log(`CameraPositionAndOrientation:`, this);
  }

  setHeight(height) {
    this.height = clamp(height, 1000, 40_000_000);
    this.flyTo();
  }

  flyTo() {
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
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cesium-viewer')
export class CesiumViewer extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 10px;
        max-width: 100vw;
        font-size: 16px;
        font-family: Helvetica, Arial, sans-serif;
      }
      button {
        font-size: 14px;
      }
    `;
  }

  @property() name = 'Cesium';

  @state() count = 0;
  @state() camera = new CameraPositionAndOrientation();

  firstUpdated() {
    this.camera.flyTo();
  }

  render() {
    return html`
      <h3>Hello, ${this.name}!</h3>
      <div>
        <button id="--" @click=${this._onClick} part="button">--</button>
        <button id="++" @click=${this._onClick} part="button">++</button>
        height: ${this.camera.height}
      </div>
      <slot></slot>
    `;
  }

  _onClick(e) {
    console.log(`_onClick:`, e, e.target.id);
    const factor = e.target.id === '--' ? 0.5 : 2.0;
    this.camera.setHeight(this.camera.height * factor);
    this.count++;
  }
}
