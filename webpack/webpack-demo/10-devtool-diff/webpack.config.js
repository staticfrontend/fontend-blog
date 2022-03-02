const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * webpack配置使用source map
 * 1.配置devtool: 'source-map'等12种模式
 * 2.不同模式对比
   eval模式：定位错误所处的文件，不会生成sourcemap文件
	 eval-source-map模式：定位错误所处的文件，相比于eval模式可以定位错误具体的行和列，并且有sourcemap文件
	 cheap-eval-source-map模式：可以定位错误具体的行，没有具体的列信息，显示es6转换后的代码
	 cheap-module-eval-source-map模式：可以定位错误具体的行，没有具体的列信息，显示es6转换前的代码（loader加工前的代码）
	 nosources-source-map模式：可以看到错误出现的位置，但是点错误信息进去看不到源代码，用于生产保护源代码
	 其他模式按照这样方式类推：
			 eval-是否使用eval执行模块代码
			 cheap- Souce Map是否包含行信息
			 module-是否能够得到Loader处理之前的源代码
 * 3.选择合适的Source Map
		开发环境下选择cheap-module-eval-source-map
		生产环境下选择none不生成sourcemap，因为Source Map会暴露源代码，调试是开发阶段的事情；或者使用nosources-source-map不向外暴露源代码内容
 */

const allModes = [
	'eval',
	'cheap-eval-source-map',
	'cheap-module-eval-source-map',
	'eval-source-map',
	'cheap-source-map',
	'cheap-module-source-map',
	'inline-cheap-source-map',
	'inline-cheap-module-source-map',
	'source-map',
	'inline-source-map',
	'hidden-source-map',
	'nosources-source-map'
]

module.exports = allModes.map(item => {
	return {
		devtool: item,
		mode: 'none',
		entry: './src/main.js',
		output: {
			filename: `js/${item}.js`
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: `${item}.html`
			})
		]
	}
})