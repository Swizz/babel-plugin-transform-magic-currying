# babel-plugin-transform-magic-currying

The goal of this plugin is to provide magic auto currying for all function like Elm does.

## Example

**In**

```js
const add = function (a, b, c) { return a + b + c; }

const min = (a, b) => a - b;

add(1,2,3) === add(1,2)(3)
add(1,2,3) === add(1)(2,3)
add(1,2,3) === add(1)(2)(3)

min(1,2) === min(1)(2)
```

**Out**

```js
const add = _magicCurrying(function add(a, b) {
  return a + b;
});

const min = _magicCurrying((a, b) => a - b);

add(1,2,3) === add(1,2)(3)
add(1,2,3) === add(1)(2,3)
add(1,2,3) === add(1)(2)(3)

min(1,2) === min(1)(2)
```

## Installation (Not ready yet)

```sh
$ npm install babel-plugin-transform-magic-currying
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-magic-currying"]
}
```

### Via CLI

```sh
$ babel --plugins transform-magic-currying script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-magic-currying"]
});
```
