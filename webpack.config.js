var path = require('path');

module.exports = {
  entry: {
    user: './client/scripts/components/User/app.jsx',
    admin: './client/scripts/components/Admin/admin.jsx',
    config: './client/scripts/components/Config/config.jsx'
  },
  output: {
    path: path.join(__dirname, 'client/build'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  resolve: {
    extensions: ['', '.jsx', '.css', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?cacheDirectory=true'
      },
      {
        test: /\.jsx/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?cacheDirectory=true'
      },
      {test: /\.css/, loader: 'style!css'}
    ]
  }
};
