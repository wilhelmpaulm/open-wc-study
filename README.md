# breaking down lit-elements / lit-html

## shortcuts to attribute property bindings

### index.js

```
import { LitElement, html } from "lit-element";

class FancyMessage extends LitElement {
  static get properties() {
    return {
      message: { type: String },
      messagePrefix: { type: String }
    };
  }

  render() {
    return html`
      <div>${this.messagePrefix} ${this.message}</div>
    `;
  }
}
customElements.define("fancy-message", FancyMessage);
```

### index.html

```
<fancy-message .messagePrefix=${messagePrefix} .message=${this.message}></fancy-message>

<fancy-message messageprefix="The message is: " .message=${this.message}></fancy-message>
```

- `propertyname="value"` if it wont be updated, you oculd use the default attribute declaration. note that since we're not using a prefix (`.`, `?`) we dont have to follow capitalization since it would be rendered as HTML
- `.propertyName=${value}` the `dot` tells lit that the attribute may change
- `?propertyName=${value}` is for `boolean` attributes
- the `${<value>}` notation is just interpolation since this is contained in a template literal

## handling events

### index.js

```
<button id="but0" @click=${() => (this.count += 1)}>+</button>

<button id="but1" @my-custom-event=${() => (this.count += 1)}>+</button>
```

### trigger it by

```
document.querySelector('#but1').dispatchEvent(new CustomEvent('my-custom-event'))
```

- you can add event listeners by using `@event-name=${action}`
- it's a good practice to pass data via events

### conditional rendering and loops

- remember that the `render()` can have anyting inside as long as the return is an HTMLElement from `html()`
- you can also interpolate HTMLElements inside html()

```
 return html`
      <div>
        <div>
          ${this.showMessage
            ? html`
                The message is: ${this.message}
              `
            : ""}
        </div>
      </div>
    `;
```

- when rendering items, you coould also leverage common es6 functions such as `map()`, `filter()`, and `reduce()`

### rendering styles

```
static get styles() {
    return css`
      :host {
        display: block;
      }

      .message {
        color: blue;
      }
    `;
  }
```

- it's best to avoid using properties inside styles so you could maximize the optimization from reducing redraws

### lifecycle methods

- `firstUpdated(changedProperties)` - ran only once, is used to focus on elements right after redirecting to a form.
- `updated(changedProperties)` - ran everytime the element returned is updated either through events or attribute updates. might be a good place to add conditions and validations.
- `connectedCallback()` - when element is inserted into the DOM
- `disconnectedCallback()` - when element is removed from the dom
- `attributeChangedCallback()` - when attributes are updated

### update lifecycle methods

- `requestUpdate()` - called when a property has changed
- `performUpdate()` - called after one or many requestUpdate have been called
- `shouldUpdate()` - controls whether an update should proceed.
- `update()` - no need to call, reflects property values to attributes and calls `render()` to render DOM`
- `render()` - uses lit-html to render the element template.
