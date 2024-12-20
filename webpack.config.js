const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash][ext][query]'
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'), // Ensure build directory
    filename: 'static/js/[name].[contenthash:8].js',
    publicPath: '/' // Serve files correctly
  }
};
