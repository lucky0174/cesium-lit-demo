/** @prettier */

import {html, css, unsafeCSS, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

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
    viewer?.camera?.flyTo({
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
 * Encapsulation of Cesium.Viewer.
 */
@customElement('cesium-viewer')
export class CesiumViewer extends LitElement {
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
        #cesiumContainer {
          /* width: auto; */
          /* height: auto; */
          background: thistle;
          border: solid 1px blue;
        }
      `,
    ];
  }

  @property({type: Boolean}) homeButton = false;
  @property({type: Boolean}) helpButton = false;

  @property({type: Number}) height = 1000000;
  set height(val) {
    let oldVal = this._height;
    this._height = val;
    this.requestUpdate('height', oldVal);
    console.log(
      `--- set height: ${val}`,
      `cameraCoordinates: ${this.cameraCoordinates}`
    );

    this.cameraCoordinates?.setHeight(this.height);
    this.cameraCoordinates?.flyTo(this.viewer);
  }
  get height() {
    return this._height;
  }

  cameraCoordinates = new CameraCoordinates();

  flyTo() {
    console.log(`--- flyTo: ${this.cameraCoordinates.height}`);
    this.cameraCoordinates.flyTo(this.viewer);
  }

  firstUpdated() {
    const cesiumContainer = this.renderRoot.getElementById('cesiumContainer');
    console.log(`firstUpdated cesiumContainer:`, cesiumContainer);
    console.log(`firstUpdated this,homeButton:`, this.homeButton);
    this.viewer = new Cesium.Viewer(cesiumContainer, {
      terrainProvider: Cesium.createWorldTerrain(),
      //animation: false,
      homeButton: this.homeButton,
      navigationHelpButton: this.helpButton,
    });
    this.flyTo();
  }

  shouldUpdate(changedProperties) {
    console.log(`--- shouldUpdate:`, changedProperties);
    // this.cameraCoordinates.setHeight(this.cameraCoordinates.height * 2);
    return true;
  }

  render() {
    console.log(`--- render this.homeButton:`, this.homeButton);
    console.log(`--- render this.helpButton:`, this.helpButton);
    console.log(`--- render this.height:`, this.height);
    return html` <div id="cesiumContainer"></div> `;
  }
}
