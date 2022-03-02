const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * 按需加载/动态导入
      需要用到某个模块时，再加载这个模块
 * 动态导入的模块会被webpack自动分包，动态导入使用的是ES Module中的动态导入import()
      如果是vue或者react单应用组件，在路由里使用动态import导入组件就可以实现自动分包按需加载
 */
// 魔法注释：import()导入的组件命名会以1.xxx.js这样命名，要想自定义分包名称，则使用魔法注释就可以了
// import(/* webpackChunkName: 'posts' */'./posts/posts') // 魔法注释，打包名会变为posts.xxx.js

module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dynamic import',
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}
