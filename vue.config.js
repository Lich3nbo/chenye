module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://api.vikingship.xyz',
        changeOrigin: true
      },
      '/user': {
        target: 'http://api.vikingship.xyz',
        changeOrigin: true
      }
    }
  }
}
