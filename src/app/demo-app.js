import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import '../components/cesium-viewer.js';
import '../components/my-element.js';
import '../components/test-element.js';

@customElement('demo-app')
export class DemoApp extends LitElement {
  render() {
    return html`
      <div
        style="border: 1px solid green; width: 90%; padding: 5px">
        <p>instantiated in demo-app.js</p>
        <test-element></test-element>
        <cesium-viewer homeButton helpButton></cesium-viewer>
      </div>
    `;
  }
}
