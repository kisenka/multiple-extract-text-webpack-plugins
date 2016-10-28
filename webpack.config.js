var path = require('path');
var TextExtractPlugin = require('extract-text-webpack-plugin');

var CSSExtractor = new TextExtractPlugin('[name].css');
var SVGExtractor = new TextExtractPlugin('[name].svg');

function findImageModule(compilation) {
  return compilation.modules.filter(function (module) {
    return module.rawRequest.match(/image\.svg/);
  })[0]
}

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
    CSSExtractor,

    {
      apply: function(compiler) {
        compiler.plugin('emit', function(compilation, done) {
          var extractSVGCompilation = compilation.children[0];
          var extractCSSCompilation = compilation.children[1];
          var imageModuleFromSVGExtractCompilation = findImageModule(extractSVGCompilation);
          var imageModuleFromCSSExtractCompilation = findImageModule(extractCSSCompilation);

          console.log('SVG extractor image source: ', imageModuleFromSVGExtractCompilation._source.source());
          console.log('CSS extractor image source: ', imageModuleFromCSSExtractCompilation._source.source());

          done();
        })
      }
    }
  ]
};