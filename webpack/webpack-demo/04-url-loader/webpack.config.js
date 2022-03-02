const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      /**
       * url加载器
       * 除了通过file-loader拷贝文件到输出目录外，还可以通过url-loader
       * url-loader: 图片会被处理为base64编码，浏览器不用再单独发送网络请求加载图片
       * 小文件使用url-loader减少网络请求，大文件单独存放（设置limit），提高加载速度
       */
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            // limit: 10 * 1024 // 10 KB
          }
        }
      }
    ]
  }
}
