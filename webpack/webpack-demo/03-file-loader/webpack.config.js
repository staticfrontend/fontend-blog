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
      // 文件资源加载器
      // file-loader用于加载图片、字体等资源文件：将导入的文件拷贝到输入的目录里，然后将拷贝路径作为当前模块的返回值返回，页面拿到这个路径
      {
        test: /.png$/,
        use: 'file-loader'
      }
    ]
  }
}
