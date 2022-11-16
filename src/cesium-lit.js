/** @prettier */

import {html, css, unsafeCSS, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

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

        /* add styles for the credit-lightbox overlay */

        .cesium-credit-lightbox-overlay {
          display: none;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(80, 80, 80, 0.8);
        }
        .cesium-credit-lightbox {
          background-color: #303336;
          color: #ffffff;
          position: relative;
          min-height: 100px;
          margin: auto;
        }
        .cesium-credit-lightbox > ul > li a,
        .cesium-credit-lightbox > ul > li a:visited {
          color: #ffffff;
        }
        .cesium-credit-lightbox > ul > li a:hover {
          color: #48b;
        }
        .cesium-credit-lightbox.cesium-credit-lightbox-expanded {
          border: 1px solid #444;
          border-radius: 5px;
          max-width: 370px;
        }
        .cesium-credit-lightbox.cesium-credit-lightbox-mobile {
          height: 100%;
          width: 100%;
        }
        .cesium-credit-lightbox-title {
          padding: 20px 20px 0 20px;
        }
        .cesium-credit-lightbox-close {
          font-size: 18pt;
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 6px;
          color: #ffffff;
        }
        .cesium-credit-lightbox-close:hover {
          color: #48b;
        }
        .cesium-credit-lightbox > ul {
          margin: 0;
          padding: 12px 20px 12px 40px;
          font-size: 13px;
        }
        .cesium-credit-lightbox > ul > li {
          padding-bottom: 6px;
        }
        .cesium-credit-lightbox > ul > li * {
          padding: 0;
          margin: 0;
        }
        .cesium-credit-expand-link {
          padding-left: 5px;
          cursor: pointer;
          text-decoration: underline;
          color: #ffffff;
        }
        .cesium-credit-expand-link:hover {
          color: #48b;
        }
        .cesium-credit-text {
          color: #ffffff;
        }
        .cesium-credit-textContainer *,
        .cesium-credit-logoContainer * {
          display: inline;
        }

        .cesium-animation-rectButton .cesium-animation-buttonGlow {
          filter: url(#animation_blurred);
        }
        .cesium-animation-rectButton .cesium-animation-buttonMain {
          fill: url(#animation_buttonNormal);
        }
        .cesium-animation-buttonToggled .cesium-animation-buttonMain {
          fill: url(#animation_buttonToggled);
        }
        .cesium-animation-rectButton:hover .cesium-animation-buttonMain {
          fill: url(#animation_buttonHovered);
        }
        .cesium-animation-buttonDisabled .cesium-animation-buttonMain {
          fill: url(#animation_buttonDisabled);
        }
        .cesium-animation-shuttleRingG .cesium-animation-shuttleRingSwoosh {
          fill: url(#animation_shuttleRingSwooshGradient);
        }
        .cesium-animation-shuttleRingG:hover
          .cesium-animation-shuttleRingSwoosh {
          fill: url(#animation_shuttleRingSwooshHovered);
        }
        .cesium-animation-shuttleRingPointer {
          fill: url(#animation_shuttleRingPointerGradient);
        }
        .cesium-animation-shuttleRingPausePointer {
          fill: url(#animation_shuttleRingPointerPaused);
        }
        .cesium-animation-knobOuter {
          fill: url(#animation_knobOuter);
        }
        .cesium-animation-knobInner {
          fill: url(#animation_knobInner);
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
