const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

/**
 * 静态资源缓存 => 输出文件名Hash
 * 1.生产模式下，文件名使用Hash，文件内容发生变化，Hash也会发生变化
 * 2.webpack中有三种Hash，使用Hash:
      第一种hash: [name]-[hash].bundle.js => 项目级别hash，项目中有任何代码改动，hash值也会发生改变
      第二种chunkhash: [name]-[chunkhash].bundle.js => 模块级别的hash
      第三种contenthash: [name]-[contenthash].bundle.js => 文件级别的hash，精确定位到了文件的hash，只有当文件改变了，才会更新打包文件的hash值；默认20位hash长度，
        可以修改为8位长度
    contenthash最适合解决缓存问题
 */
module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name]-[contenthash:8].bundle.js'
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader,
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
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].bundle.css'
    })
  ]
}
