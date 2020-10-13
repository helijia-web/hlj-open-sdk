const { createConfig } = require('@hlj/webpack-config');

module.exports = createConfig({
  digest: false,
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  }
});
