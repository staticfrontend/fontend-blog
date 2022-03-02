const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  // css资源模块加载
  // main.js里通过import导入了css文件，需要通过css-loader加载css资源处理，然后使用style-loader插入到页面中
  module: {
    rules: [
      {
        test: /.css$/,
        // use里面的loader执行顺序为从后往前执行
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
