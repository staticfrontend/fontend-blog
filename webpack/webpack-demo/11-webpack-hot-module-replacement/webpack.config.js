const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * webpack热更新 hot module replacement
 * 配置：
    devServer.hot配置为true
    plugins配置添加new webpack.HotModuleReplacementPlugin()
    css会自动开启热更新，js由于业务逻辑原因不会，需要手动配置
   手动处理js模块热替换
 */
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    hot: true
    // hotOnly: true // 只使用 HMR，不会 fallback 到 live reloading
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Tutorial',
      template: './src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
