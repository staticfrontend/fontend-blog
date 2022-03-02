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
      /**
       * loader工作原理：详细见./markdown-loader.js文件
       * 1.use里面使用loader，对应loader里使用module.exports导出一个函数，loader里函数输入参数source为加载资源的内容，输出处理资源的结果
       * 2.loader里返回结果必须为js代码，如果返回不是js，则应该交给下一个loader继续处理
       * 3.webpack将loader返回结果拼接到模块代码中
       所以laoder负责资源文件从输入到输出的转换
       */
      {
        test: /.md$/,
        use: [
          'html-loader',
          './markdown-loader'
        ]
      }
    ]
  }
}
