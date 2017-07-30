var webpack = require('webpack'),
	path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
	context: __dirname,
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js'
	},
	plugins: [
		// new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
		new CopyWebpackPlugin([
			{from: 'src/index.html'},
			{from: 'src/styles/styles.css'}
		])
	],

	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		compress: true,
		port: 3000
	}
};