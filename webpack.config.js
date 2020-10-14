const { createConfig } = require('@hlj/webpack-config');

module.exports = createConfig({
  digest: false,
  distPath: 'dist',
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  },
  output: {
    library: 'hlj_open_sdk',
    libraryTarget: 'umd',
    filename: 'app.js'
  }
});
