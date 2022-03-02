const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

/**
 * MiniCssExtractPlugin 自动提取css到单个文件，实现css文件的按需加载
 * 配置：
    plugins里添加：
    plugins: [
      new MiniCssExtractPlugin()
    ]
    rules里添加：
    use: [
      // 'style-loader', // 将样式通过 style 标签注入
      MiniCssExtractPlugin.loader, // 按需通过link标签注入
      'css-loader'
    ]
  * 压缩css
      optimize-css-assets-webpack-plugin
      optimization: {
        minimizer: [
          // 压缩js
          new TerserWebpackPlugin(),
          // 压缩css
          new OptimizeCssAssetsWebpackPlugin()
        ]
  },
 */
module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  optimization: {
    minimizer: [
      // 压缩js
      new TerserWebpackPlugin(),
      // 压缩css
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader, // 按需通过link标签注入
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
    }),
    new MiniCssExtractPlugin()
  ]
}
