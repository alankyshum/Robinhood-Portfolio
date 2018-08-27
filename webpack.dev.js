const webpack = require('webpack');
const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',
				test: /\.js$/
			}
		]
	},

	entry: path.resolve(__dirname, 'src/index.js'),

	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'commonjs2' // exported thru Module Definition System - commonjs
	},

	mode: 'development',

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},

	target: 'node',

	plugins: [
		new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop')
	]
};
