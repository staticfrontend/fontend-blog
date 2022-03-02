/**
 * tree-shaking：webpack自动检测出代码中未使用的代码，然后移除它们
 * 1.在wbepack4中配置
      optimization.usedExports: true => 只导出使用了的成员，未使用成员在webpack打包模块代码里不会被导出（也就是__webpack_require__.d里面不会导出外部没有导入的成员）
      然后使用minimize: true就可以做到无用代码tree-shaking了，不会打包无用代码了

 * 2.webpack4 optimization其他优化：
      optimization.concatenateModules: true => 尽可能将所有的模块合并输出到一个函数中（webpack3中被称为作用域提升Scope Hoisting），
      这样就可以提升js的运行效率，又减少了重复的模块包裹的代码体积
 * 3. tree-shaking的前提是ES Modules，也就是由webpack打包的代码必须使用ESM
      babel-loader在转换es6代码的时候，可能把代码中的ES Modules 转换为CommonJs，最新的babel-loader中默认支持ES Modules(默认禁止ES Modules的转换)
      babel-loader 会自动关闭 ESM 转换的配置为：['@babel/preset-env', { modules: false }] 或 ['@babel/preset-env', { modules: 'auto' }]
 */
module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // 如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效
              // ['@babel/preset-env', { modules: 'commonjs' }]
              // ['@babel/preset-env', { modules: false }]
              // 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
              ['@babel/preset-env', { modules: 'auto' }]
            ]
          }
        }
      }
    ]
  },
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 尽可能将所有的模块合并输出到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    // minimize: true
  }
}
