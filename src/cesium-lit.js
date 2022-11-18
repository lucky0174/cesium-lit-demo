/** @prettier */

import {html, css, unsafeCSS, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import * as Cesium from 'cesium';

// This works, tested in dev and in build+preview
import widgetCssRaw from 'cesium/Build/Cesium/Widgets/widgets.css';
const widgetsCss = css`
  ${unsafeCSS(widgetCssRaw)}
`;

import creditDisplayCssRaw from './cesium-credit-display.css';
const creditDisplayCss = css`
  ${unsafeCSS(creditDisplayCssRaw)}
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
    // Pierre du Niton, Geneva, Switzerland
    this.lngDeg = 6.15444444;
    this.latDeg = 46.20555556;
    this.height = 200000;
    this.heading = 0.0;
    this.pitch = -90.0;
    this.roll = 0.0;
  }

  setHeight(height) {
    this.height = clamp(height, 1000, 32_768_000);
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
      widgetsCss,
      creditDisplayCss,
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
          /* width: auto; */
          /* height: auto; */
          background: thistle;
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

  cesiumMeetsLit = html`<h3>
    <a href="https://cesium.com/platform/cesiumjs/">Cesium</a> meets
    <a href="https://lit.dev/">Lit</a>
  </h3>`;

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
        ${this.cesiumMeetsLit}
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
