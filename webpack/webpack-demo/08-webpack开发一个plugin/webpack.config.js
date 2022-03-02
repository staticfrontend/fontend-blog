const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

/**
 * 实现一个清除打包代码中的/******注释信息
 * 插件必须为一个函数或者对象
 * apply方法会在webpack启动时自动被调用，接收一个compiler对象参数，compiler包含了构建的所有配置信息
 * 通过compiler注册钩子函数
 * */

class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')

    // 通过compiler注册钩子函数，emit钩子函数为webpack即将往输出目录输出文件时执行，符合删除最后注释信息的需求
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) { // compilation.assets获取资源文件信息 
        // console.log(name) // 文件名称
        // console.log(compilation.assets[name].source()) // 文件内容
        if (name.endsWith('.js')) { // 只处理.js结尾文件
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
          compilation.assets[name] = {
            source: () => withoutComments, // 覆盖文件内容
            size: () => withoutComments.length // 内容大小
          }
        }
      }
    })
  }
}

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // publicPath: 'dist/'
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
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    }),
    // 用于生成 about.html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    }),
    // new CopyWebpackPlugin([
    //   // 'public/**'
    //   'public'
    // ]),

    /**
     * webpack开发一个插件
     * Loader只用在加载模块的时候，相比于Loader，Plugin的范围几乎可以触及到webpack的每个环节，Plugin用于扩展webpack的能力
     * 1.webpack的Plugin通过钩子机制实现，给钩子扩展功能
     * 2.webpack要求Plugin是一个函数或者是一个包含apply方法的对象
     * 3.webpack的Plugin原理也就是通过在生命周期的钩子函数中挂载函数实现扩展
     */
    new MyPlugin()
  ]
}
