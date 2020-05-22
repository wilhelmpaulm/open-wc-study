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

---

## handling events

### index.js

```
<button id="but0" @click=${() => (this.count += 1)}>+</button>

<button id="but1" @my-custom-event=${() => (this.count += 1)}>+</button>
```

---

### trigger it by

```
document.querySelector('#but1').dispatchEvent(new CustomEvent('my-custom-event'))
```

- you can add event listeners by using `@event-name=${action}`
- it's a good practice to pass data via events

---

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

---

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

---

### lifecycle methods

- `firstUpdated(changedProperties)` - ran only once, is used to focus on elements right after redirecting to a form.
- `updated(changedProperties)` - ran everytime the element returned is updated either through events or attribute updates. might be a good place to add conditions and validations.
- `connectedCallback()` - when element is inserted into the DOM
- `disconnectedCallback()` - when element is removed from the dom
- `attributeChangedCallback()` - when attributes are updated

---

### update lifecycle methods

- `requestUpdate()` - called when a property has changed
- `performUpdate()` - called after one or many requestUpdate have been called
- `shouldUpdate()` - controls whether an update should proceed.
- `update()` - no need to call, reflects property values to attributes and calls `render()` to render DOM`
- `render()` - uses lit-html to render the element template.

---

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

---

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

---

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

---

### adding slots or "child elements" to a component

#### parent

```
<div class="card-wrapper">
    <slot name="title"></slot>
    <slot name="details"></slot>
    <slot></slot>
</div>
```

### usage

```
<card-element>
  <h1 slot="title">Hello universe</h1>
  <p slot="details">This is some text</p>
  <p>any other content</p>
</card-element>

```

- `<slot name="slotName">` on the containing element
- `<custome-element><p slot="slotName">asd</p></custom-element>` when using slots

---

### property setter observer

- literally was just confused for hours . . .
- basically you just use static getters and setters . . .

---

### until directive

```
${until(
  this.messageRequest,
  html`
    Loading...
  `
)}
```

```
this.messageRequest = new Promise(resolve => {
  setTimeout(() => resolve("Hello world"), 2000);
});
```

- you would have seen these before, especially for single page apps.
- the first param of `until()` is the promise (the content)
- after the promise resolves, it would overwrite the `2nd parameter` which is the `placeholder`

---

### template wrapping and sharing

- this is best explained by:

```
html`<div>${html`<span>uno</span>`} dos tres</div>`
```

- since `html()` returns an HTMLElement, you can share it with other templates as long as it isn't recursive.

---

### shared styles

- similar to `html()`, `css()` also returns a cleaned up html ...
- so you could also share css

```
const sharedStyles = css`
  :host {
    display: block;
  }

  .box-wrapper {
    border: 5px solid red;
  }

  .box {
    width: 36px;
    height: 36px;
    background-color: blue;
  }
`;
```

---

## external template and the template tag

- one greate feature of HTML5 is the kinda new `<template>` tag
- everything inside the `<template></template>` tags arent rendered or loaded (media isn't requested).
- a great use of this is for generating dynamic repeated content such as `<tr>` for those tables that you could filter or populate. with `<template>` you don't have to go through the hassle of either recreating it via JS or the messy hide element boiler plate.
- all you have to do is clone it:

```
document.querySelector('tr.newTr').cloneNode(true);
// append it somewhere
// ps. dont just append the element without cloning since that would just move it
// clone then append => ctrl C + ctrl V
// append => ctrl X + ctrl V
```

- now why use this? because the browser is really fast at parsing HTML and you can organize your templates more cleanly and then import it to your webcomponent

---

## template factories

```
const templateFactory = (inputValue, buttonText, onSubmit) => html`
  <input id="usernameInput" value="${inputValue}" />

  <button @click="${onSubmit}">
    ${buttonText}
  </button>
`;
```

- for templates that you would reuse, it's a good idea to create a factory to reduce boilerplate and make your code more expressive
- why factories? well you don't have to stick to it. you could easily use any creational pattern you would like just as long as you return the values from `html()`

---

## shouldUpdate() - should update

```
shouldUpdate(changedProperties) {
  return this.propA;
}
```

- this is a particularly confusing method at the start due to the lack of documentation or the bad description for it but it's fairly easy to understand once there's more details to the method
- lets update it a bit and break it down

```
shouldUpdate(changedProperties = {propA: 132, propB: 'black'} ) {
  if (propA >= 12) return true;
  return false;
}
```

- `shouldUpdate()` is the one reponsible for telling the browser if the component would do an `update()` which would do a `render()`.
- better right? if you try to just return `false` on a component's `shouldUpdate()` method, and refresh the page, it would render in the page. that's because it's telling the browser to not update it ergo not render it.
- the parameter of `shouldUpdate()` is actually a `Map or Object` of the updated properties of your component, you could use this info to either return:
- - `true` to call `update()`
- - `false` to cancel the `update()` call
