const path = require('path');
const baseConfig = require('./base.config.js');

module.exports = Object.assign({}, baseConfig, {
  output: {
    path: path.join(baseConfig.context, 'dist'),
    filename: 't8on.min.js',
    library: 't8on',
    libraryTarget: 'umd'
  }
});
