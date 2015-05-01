module.exports = {
	entry: {
		user: './client/scripts/components/User/app.jsx',
		admin: ['./client/scripts/components/Admin/admin.jsx']
	},
	output: {
		path: __dirname + '/client/build',
		filename: '[name].js',
		sourceMapFilename: '[file].map'
	},
	resolve: {
		extensions: ['', '.jsx', '.css', '.js']
	},

	module: {
		loaders: [
			{test: /\.js/, loader: 'babel-loader'},
			{test: /\.jsx/, loader: 'babel-loader'},
			{test: /\.css/, loader: 'style!css'}
		]
	}
}; 