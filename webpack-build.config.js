/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-06
 */
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var packages = require('./package.json');

module.exports = {
	devtool: 'source-map',
	entry: [
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'es6-utils.min.js'
	},
	externals: Object.keys(packages.dependencies || []),
	plugins: [
		new CleanPlugin('dist'),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js']
	},
	eslint: {
		configFIle: '.eslintrc',
		emitWarning: true,
		emitError: true,
		formatter: require('eslint-friendly-formatter')
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: path.join(__dirname, 'src')
			}
		],

		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				exclude: /(node_modules|bower_components)/,
				include: path.join(__dirname, 'src')
			}
		]
	}
};
