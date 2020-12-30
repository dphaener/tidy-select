# tidy-select

JavaScript library for making HTML selects more tidy.

Based heavily off of the original jQuery based [tidy-select](https://github.com/derrickreimer/tidy-select),
this turns it into a no dependencies web component.

## Usage

Somewhere in your project just require the tidy select module:
```js
import 'tidy-select';
```

Then you can use it in your HTML:
```html
<tidy-select>
  <option value="1">One!</option>
  <option value="2" data-description="I have a description">Two!</option>
</tidy-select>
```
