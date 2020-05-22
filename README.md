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

### getting values from inside the shadowDOM

```
  get usernameInput() {
    return this.shadowRoot.getElementById("usernameInput");
  }

  get username() {
    // Use the input getter, and get the value property from the input element
    return this.usernameInput.value;
  }
```

- you wont be able to get values through regular queries since the elemnts are inside the shadow dom.
- what you could do is replace `document` with `shadowRoot` when doing getElement or querySelector calls
- if you wanna move out of the shadowDOM you could use `createRenderRoot()` and return `this`. this will move your render to the `"light" DOM` but `styles` and `slots` wont workd anymore.

### reflecting attributes

```
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true
        // you can also specify _how_ you want the attribute to be reflected:
        // attribute: 'my-attribute'
        // will reflect this property as 'my-attribute' on your element.
      }
    };
  }
```

- I'm still unsure about `reflect` but I think it's allowing you to `reflect` changes in properties back to the attributes.

### stop recreating elements on list update with repeat

```
  render() {
    return html`
      <div>
        <button @click="${this.reorder}">Re-order items (random)</button>
        ${repeat(
          this.items, // the array of items
          item => item.id, // the identify function
          (item, i) =>
            html`
              <div>[${i}] Message ${item.id}: ${item.message}</div>
            ` // the template for each item
        )}
      </div>
    `;
  }
```

- similar to how `react` does it, by assining keys to the elements that's in a list, `lit` knows what elements are going to be rendered agian based on the updated properties. use this instead of `filter, map, or reduce` when handling lists that gets additional elements or only updates a small set of elements.
