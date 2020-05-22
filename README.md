# breaking down lit-elements / lit-html

## shortcuts to attribute property bindings

- `propertyname="value"` if it wont be updated, you oculd use the default attribute declaration. note that since we're not using a prefix (`.`, `?`) we dont have to follow capitalization since it would be rendered as HTML
- `.propertyName=${value}` the `dot` tells lit that the attribute may change
- `?propertyName=${value}` is for `boolean` attributes
- the `${<value>}` notation is just interpolation since this is contained in a template literal
-
