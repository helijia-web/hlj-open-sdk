const pathUtil = require('path');
const { createConfig } = require('@hlj/webpack-config');


module.exports = createConfig({
  digest: false,
  distPath: 'dist',
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  },
  entry: {
    lib: pathUtil.join(__dirname, 'src/index.js')
  },
  output: {
    library: 'hlj_open_sdk',
    libraryTarget: 'umd',
    filename: 'lib.js'
  }
});
