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
  },
  resolve: {
    alias: {
      moment: 'dayjs',
      'es6-promise': pathUtil.join(__dirname, 'node_modules/es6-promise')
    }
  }
});
