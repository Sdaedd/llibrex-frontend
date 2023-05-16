module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify")
      }
    },
    resolveLoader: {
      fallback: {
        "crypto": require.resolve("crypto-browserify")
      }
    }
  }
};
