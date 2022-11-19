import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import '../components/cesium-viewer.js';
import '../components/my-element.js';
import '../components/flight-dashboard.js';

@customElement('demo-app')
export class DemoApp extends LitElement {
  about = html`
    <div>
      <fieldset>
        <legend>
          Prototyping a &lt;cesium-viewer&gt; Lit component v0.1.0
        </legend>
        <ul>
          <li>component embeds a Cesium.Viewer</li>
          <li>
            component exposes a public API - a tiny subset of the Cesium.Viewer
            API
          </li>
          <li>
            <a href="https://github.com/rudifa/cesium-lit-demo" target="_blank"
              >source</a
            >
          </li>
          <li>
            <a href="https://cesium-lit-demo.netlify.app/" target="_blank"
              >deployed</a
            >
          </li>
          <li> by
            <a href="https://github.com/rudifa/" target="_blank"
              >rudifa</a
            >
          </li>
        </ul>
      </fieldset>
    </div>
  `;

  render() {
    return html`
      <div style="border: 1px solid green; margin: 2px; padding: 5px">
        ${this.about}
        <flight-dashboard></flight-dashboard>
        <!--   
        <cesium-viewer homeButton helpButton></cesium-viewer>
        -->
      </div>
    `;
  }
}
