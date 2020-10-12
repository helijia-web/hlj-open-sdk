export default {
  entry: [
    'src/loadScript.js',
    'src/env'
  ],
  esm: {
    minify: true
  },
  doc: {
    base: '/hlj-open-sdk'
  },
}