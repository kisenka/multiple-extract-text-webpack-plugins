var path = require('path');
var TextExtractPlugin = require('extract-text-webpack-plugin');

var CSSExtractor = new TextExtractPlugin('[name].css');
var SVGExtractor = new TextExtractPlugin('[name].svg');

module.exports = {
  entry: {
    main: './src/main'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
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
  plugins: [
    SVGExtractor,
    CSSExtractor
  ]
};