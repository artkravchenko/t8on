const path = require('path');
const webpack = require('webpack');

const context = path.resolve(__dirname, '..');

module.exports = {
  context: context,
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        pure_getters: true,
        screw_ie8: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
      sourceMap: false,
      output: {
        comments: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};
