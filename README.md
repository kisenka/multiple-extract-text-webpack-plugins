# Multiple extract-text-webpack-plugin instances

- [stackoverflow.com](http://stackoverflow.com/questions/40306032/multiple-extract-text-webpack-plugin-instances)

## Description

I want to do the following thing:

1. Merge many SVGs in a single sprite (done via svg-sprite-loader).
2. Extract sprite as separate file (done via svg-sprite-loader/lib/extract-svg-plugin, tiny wrapper over the extract-text-webpack-plugin which just wraps result with <svg> tags to get valid svg markup).
3. Return path to extracted SVG with fragment identifier which refers to specific sprite symbol, e.g. `sprite.svg#image`. This is doable unless you want to refer SVG image (which is extracted via extract plugin) in CSS which is also extracted via second extract plugin instance.

Example:

**webpack.config.js**

```js
var TextExtractPlugin = require('extract-text-webpack-plugin');

var CSSExtractor = new TextExtractPlugin('[name].css');
var SVGExtractor = new TextExtractPlugin('[name].svg');

module: {
  loaders: [
    {
      test: /\.css$/,
      loader: CSSExtractor.extract('css')
    },
    {
      test: /\.svg$/,
      loader: SVGExtractor.extract('raw') // emulate svg-sprite-loader
    }
  ]
},
```

**styles.css**

```css
.img {
  background-image: url('./image.svg');
}
```

CSS will be compiled to

```css
.img {
  background-image: url([object Object]);
}
```

I think it's because in first (SVG) extract compilation all image source was removed by extract-plugin, and in the second (CSS) extract compilation gets cached module result from webpack with empty content. I am trying to patch extract plugin loader and return some result instead of `// // removed by extract-text-webpack-plugin`, but have no success. In second extract compilation image module still has empty content.
Is it possible to implement desired behaviour with extract plugin?

## Install

```
npm install
npm run build
```
