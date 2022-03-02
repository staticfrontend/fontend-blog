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
       * webpack只是打包工具，不会转换es6代码；webpack编译代码为es5：babel-loader
       * 1.babel-loader需要依赖babel核心模块babel-core和用于转换具体特性插件集合preset-env => npm i babel-loader @babel/core @babel/preset-env -D
       * 2.babel-loader只是转换js代码的平台，转换具体特性需要配置所需要的插件，可将插件写在options里或者babel文件里
          options: {
            presets: ['@babel/preset-env']
          }
       */
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10 KB
          }
        }
      }
    ]
  }
}
