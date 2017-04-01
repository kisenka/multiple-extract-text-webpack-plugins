const path = require('path');
const TextExtractPlugin = require('extract-text-webpack-plugin');

const CSSExtractor = new TextExtractPlugin({ filename: '[name].css' });
const SVGExtractor = new TextExtractPlugin({ filename: '[name].svg' });

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
    rules: [
      {
        test: /\.css$/,
        use: CSSExtractor.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.svg$/,
        use: SVGExtractor.extract({
          use: 'raw-loader' // emulate svg-sprite-loader
        })
      }
    ]
  },
  plugins: [
    SVGExtractor,
    CSSExtractor,

    {
      apply: function(compiler) {
        compiler.plugin('emit', function(compilation, done) {
          const  extractSVGCompilation = compilation.children[0];
          const  extractCSSCompilation = compilation.children[1];
          const  imageModuleFromSVGExtractCompilation = findImageModule(extractSVGCompilation);
          const  imageModuleFromCSSExtractCompilation = findImageModule(extractCSSCompilation);

          console.log('SVG extractor image source: ', imageModuleFromSVGExtractCompilation._source.source());
          console.log('CSS extractor image source: ', imageModuleFromCSSExtractCompilation._source.source());

          done();
        })
      }
    }
  ]
};