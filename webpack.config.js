const { createConfig } = require('@hlj/webpack-config');

module.exports = createConfig({
  digest: false,
  distPath: 'dist',
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  }
});
