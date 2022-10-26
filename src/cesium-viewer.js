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
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(6.14569, 46.20222, 200000),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-90.0),
  },
});

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
        max-width: 800px;
        font-size: 16px;
      }
      button {
        font-size: 14px;
      }
    `;
  }

  @property() name = 'World of Cesium';

  @state() count = 0;

  render() {
    return html`
      <h3>Hello, ${this.name}!</h3>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
  }

  _onClick() {
    this.count++;
  }
}
