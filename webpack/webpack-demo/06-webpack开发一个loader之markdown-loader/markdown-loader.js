const marked = require('marked') // marked用于markdown的解析

module.exports = source => {
  // module.exports导出一个函数，参数source为加载资源的内容，输出为处理资源的结果
  // loader里返回结果必须为js代码，如果返回不是js，则应该交给下一个loader继续处理

  // console.log(source)
  const html = marked(source)

  // 方式1. 使用module.exports转为js代码
  // return `module.exports = "${html}"`

  // 方式2. 使用module.exports转为js代码，JSON.stringify转不会丢失空格
  // return `export default ${JSON.stringify(html)}`

  // 方式3. 返回 html 字符串交给下一个 loader 处理，需要html-loader继续处理
  return html
}
