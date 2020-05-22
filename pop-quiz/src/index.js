import { LitElement, html } from 'lit-element';

class FetchingData extends LitElement {
  static get properties() {
    return {
      response: { type: Array },
    };
  }

  constructor() {
    super();
    this.response = [];
  }

  firstUpdated() {
    fetch('https://reqres.in/api/users?page=1')
      .then(r => r.json())
      .then(r => {
        this.response = r.data;
      });
  }

  render() {
    const { response } = this;
    return html`
      <h3>example list</h3>
      <ul>
        ${response.map(item => html` <li>${item.first_name}</li> `)}
      </ul>
    `;
  }
}

customElements.define('fetching-data', FetchingData);
