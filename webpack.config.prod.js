/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

var path = require('path');
var webpack = require('webpack');

module.exports = {
  stats: {
    hash: false,
    version: false,
    timings: false,
    assets: true,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false
  },
  entry: {
    user: './client/scripts/components/user/app.js',
    admin: './client/scripts/components/admin/admin.js',
    config: './client/scripts/components/config/config.js',
    about: './client/scripts/components/about/about.js',
    features: './client/scripts/components/features/app.js'
  },
  output: {
    path: path.join(__dirname, 'client/build'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', 'index.js', '.css', 'style.css']
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
      {
        test: /\.css/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss'
      }
    ]
  },
  postcss: [
    require('autoprefixer')
  ]
};
