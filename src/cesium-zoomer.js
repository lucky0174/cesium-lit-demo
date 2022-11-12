/** @prettier */

import {html, css, unsafeCSS, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import * as Cesium from 'cesium';
// 1
// not knowing how to import the widgets.css file, I just copy it into widgets.js
// and added the code to export the styles as css`...`
// it works
import {widgetStyles} from './widgets.js';

// 2
// This also works, tested in dev and in build+preview
import widgetStylesRaw from 'cesium/Build/Cesium/Widgets/widgets.css';
const widgetStyles2 = css`
  ${unsafeCSS(widgetStylesRaw)}
`;

console.log(`widgetStylesRaw = ${widgetStylesRaw}`);
console.log(` widgetStyles2 = `, widgetStyles2);
// ^^^ is a CSSResult, looks good ^^^

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDY5YjNjNy05ZDZjLTQ5YjUtODBhOC03MGY4Njc3MzUyMDEiLCJpZCI6MTEyNTc3LCJpYXQiOjE2NjY4MTYyNjB9.fd9TA4pMsDaKBWE1lSEBvYB34xR-R1anLfSG-vSVI4c';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
// const viewer = new Cesium.Viewer('cesiumContainer', {
//   terrainProvider: Cesium.createWorldTerrain(),
// });
// Add Cesium OSM Buildings, a global 3D buildings layer.
// const buildingTileset = viewer.scene.primitives.add(
//   Cesium.createOsmBuildings()
// );

// Fly the camera to Geneva at the given longitude, latitude, and height.
// viewer.camera.flyTo({
//   destination : Cesium.Cartesian3.fromDegrees(6.14569, 46.20222, 200000),
//   orientation : {
//     heading : Cesium.Math.toRadians(0.0),
//     pitch : Cesium.Math.toRadians(-15.0),
//   }
// });

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
 * A partial encapsulation of Cesium Viewer custom controls.
 */
@customElement('cesium-viewer2')
export class CesiumViewer extends LitElement {
  static get styles() {
    return [
      widgetStyles2,
      css`
      :host {
        /* display: block; no effect */
        border: solid 1px red;
        background: pink;
        padding: 10px;
        max-width: 100vw;
        max-height: 100vw; */ /*no effect*/
        font-size: 16px;
        font-family: Helvetica, Arial, sans-serif;
        /* box-sizing: content-box; no effect */
      }
      button {
        font-size: 14px;
      }
      #cesiumContainer2 {
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
      }
      #separator {
        width: 100%;
        background: skyblue;
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
    const cesiumContainer2 = this.renderRoot.getElementById('cesiumContainer2');
    console.log(`firstUpdated cesiumContainer2:`, cesiumContainer2);
    this.viewer = new Cesium.Viewer(cesiumContainer2, {
      terrainProvider: Cesium.createWorldTerrain(),
      // cesiumWidget: true,
      // infoBox: true,
    });
    // this.viewer.forceResize();
    this.flyTo();
  }

  render() {
    return html`

      <h3>Hello, ${this.name}!</h3>
      <div>
        <button id="--" @click=${this._onClick} part="button">--</button>
        <button id="++" @click=${this._onClick} part="button">++</button>
        height: ${this.cameraCoordinates.height}
      </div>
      <div id="separator">div 1</div>
      <div id="cesiumContainer2">div 2: #cesiumContainer2</div>
      <div id="separator"">div 3</div>
 
    `;
  }

  _onClick(e) {
    const factor = e.target.id === '--' ? 0.5 : 2.0;
    this.cameraCoordinates.setHeight(this.cameraCoordinates.height * factor);
    this.flyTo();
    this.requestUpdate();
  }
}
