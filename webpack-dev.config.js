/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-06
 */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry  : [
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    './test/app'
  ],
  output : {
    path      : path.join(__dirname, 'build'),
    filename  : 'bundle.js',
    publicPath: 'http://localhost:3000/build/' // hot loader publish dir
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  },
  eslint : {
    configFIle : '.eslintrc',
    emitWarning: true,
    emitError  : true,
    formatter  : require('eslint-friendly-formatter')
  },
  module : {
    preLoaders: [
      {
        test   : /\.js$/,
        loader : 'eslint-loader',
        exclude: /node_modules/,
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')]
      }
    ],

    loaders: [
      {
        test   : /\.js$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/,
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')]
      }
    ]
  }
};
