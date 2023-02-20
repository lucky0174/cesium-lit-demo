/** @prettier */

import {html, css, unsafeCSS, LitElement} from 'lit';

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

  // update this from an object specifying some or all of the properties
  update(obj) {
    console.log(`CameraCoordinates update:`, obj);
    this.lngDeg = obj.lngDeg ?? this.lngDeg;
    this.latDeg = obj.latDeg ?? this.latDeg;
    this.height = obj.height ?? this.height;
    this.heading = obj.heading ?? this.heading;
    this.pitch = obj.pitch ?? this.pitch;
    this.roll = obj.roll ?? this.roll;
  }

  static from(camera) {
    if (!camera) return undefined;
    const coords = new CameraCoordinates();
    coords.lngDeg = Cesium.Math.toDegrees(
      camera.positionCartographic.longitude
    );
    coords.latDeg = Cesium.Math.toDegrees(camera.positionCartographic.latitude);
    coords.height = camera.positionCartographic.height;
    coords.heading = Cesium.Math.toDegrees(camera.heading);
    coords.pitch = Cesium.Math.toDegrees(camera.pitch);
    coords.roll = Cesium.Math.toDegrees(camera.roll);
    return coords;
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

  static get properties() {
    return {
      cameraCoords: {type: Object},
      homeButton: {type: Boolean},
      helpButton: {type: Boolean},
      height: {type: Number},
      cameraQuery: {type: Number},
    };
  }

  constructor() {
    super();
    this.cameraCoords = {};
    this.homeButton = false;
    this.helpButton = false;
    this.height = 1000000;
    this.cameraQuery = 0;
  }

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

  set cameraQuery(val) {
    // get camera coordinates and send them to the parent via the event
    const coords = CameraCoordinates.from(this.viewer?.camera);
    // console.log(`--- cameraQuery: ${val}`, `cameraCoordinates:`, coords);
    this.dispatchEvent(
      new CustomEvent('camera-query', {
        detail: coords,
        bubbles: true,
        composed: true,
      })
    );
  }

  cameraCoordinates = new CameraCoordinates();

  flyTo() {
    // console.log(`--- flyTo: ${this.cameraCoordinates.height}`);
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
    this.viewer.camera.moveEnd.addEventListener( () => {
        console.log(`camera stopped moving`, this);
        // send custom event to parent
        this.cameraQuery = -1;
    });
    this.flyTo();
  }

  shouldUpdate(changedProperties) {
    // console.log(`cesium-viewer shouldUpdate:`, changedProperties);
    // this.cameraCoordinates.setHeight(this.cameraCoordinates.height * 2);
    return true;
  }

  willUpdate(changedProperties) {
    // console.log(`cesium-viewer willUpdate:`, changedProperties);
    if (changedProperties.has('cameraCoords')) {
      // update cameraCordinates from cameraCoords
      this.cameraCoordinates.update(this.cameraCoords);
      this.flyTo();
      // this.requestUpdate();
    }
  }

  render() {
    // console.log(`--- render this.viewer:`, this.viewer);
    // console.log(`--- render viewer.camera:`, this.viewer?.camera);

    return html` <div id="cesiumContainer"></div> `;
  }
}

window.customElements.define('cesium-viewer', CesiumViewer);
