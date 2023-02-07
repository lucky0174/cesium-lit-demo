import {html, css, LitElement} from 'lit';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
        font-size: 16px;
      }
      button {
        font-size: 14px;
      }
    `;
  }

  static get properties() {
    return {
      name: {type: String},
      ok: {type: Boolean},
      also: {type: Boolean},
      count: {type: Number},
    };
  }

  constructor() {
    super();
    this.name = 'World';
    this.ok = false;
    this.also = false;
    this.count = 0;
  }

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <p>ok ${this.ok} also ${this.also}</p>
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

customElements.define('my-element', MyElement);
