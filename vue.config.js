module.exports = {
  lintOnSave: false,
  configureWebpack: {
    entry: {
      app: './src/main.ts'
    },
    output: {
      path: __dirname + '/dist'
    },
  }
}