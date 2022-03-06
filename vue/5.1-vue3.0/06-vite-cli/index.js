#!/usr/bin/env node
/** 
 * Vite的实现原理
 * Vite的核心功能
      • 静态 Web 服务器
      • 编译单文件组件 =》 拦截浏览器不识别的模块，并处理
 */

const path = require('path')
const { Readable } = require('stream')
const Koa = require('koa')
const send = require('koa-send')
const compilerSFC = require('@vue/compiler-sfc')

const app = new Koa()

// 接收文件流
const streamToString = stream => new Promise((resolve, reject) => {
  const chunks = []
  // 接收数据
  stream.on('data', chunk => chunks.push(chunk))
  // 数据读取完毕，将chunks中Buffer合并转为字符串
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  // 出错reject
  stream.on('error', reject)
})

const stringToStream = text => {
  const stream = new Readable()
  stream.push(text)
  stream.push(null)
  return stream
}

// 3. 加载第三方模块：以/@modules/开头的路径去node_modules里找模块
app.use(async (ctx, next) => {
  // ctx.path --> /@modules/vue
  if (ctx.path.startsWith('/@modules/')) {
    const moduleName = ctx.path.substr(10)
    // 找第三方模块路径的package.json
    const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json')
    // 通过require加载第三方模块路径的package.json
    const pkg = require(pkgPath)
    // 找到package.json的module字段的第三方模块的打包文件路径
    ctx.path = path.join('/node_modules', moduleName, pkg.module)
  }
  await next()
})

// 1. 开启静态文件服务器
app.use(async (ctx, next) => {
  // 返回静态文件
  await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' }) // process.cwd() 当前运行node的目录
  
  // 返回执行下一个中间件
  await next()
})

// 4. 处理单文件组件：compilerSFC这个vue提供的模块用来编译单文件组件
app.use(async (ctx, next) => {
  if (ctx.path.endsWith('.vue')) {
    // 将文件流转为字符串
    const contents = await streamToString(ctx.body)
    // 编译单文件组件内容，返回单文件组件的描述对象descriptor
    const { descriptor } = compilerSFC.parse(contents)
    let code
    if (!ctx.query.type) { // 第一次请求
      code = descriptor.script.content
      // console.log(code)

      // 将export default 替换为 const __script = 
      code = code.replace(/export\s+default\s+/g, 'const __script = ')

      // 拼接上固定格式的代码
      code += `
      import { render as __render } from "${ctx.path}?type=template"
      __script.render = __render
      export default __script
      `
    } else if (ctx.query.type === 'template') {
      const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
      code = templateRender.code
    }
    ctx.type = 'application/javascript'
    // 将字符串转换为可读流
    ctx.body = stringToStream(code)
  }
  await next()
})

// 2. 修改第三方模块的路径: 把静态文件返回给浏览器，浏览器识别不了node_modules的模块比如vue，所以要修改第三方模块的路径
app.use(async (ctx, next) => {
  // 判断返回给浏览器的文件是javascript 则处理文件路径
  if (ctx.type === 'application/javascript') {
    // 文件内容是流 转为字符串
    const contents = await streamToString(ctx.body)

    // import vue from 'vue' =》 处理为 import vue from '/@modules/vue'
    // import App from './App.vue' =》 不需要处理
    // 将contents第三方模块路径修改
    // (from\s+['"]) 第一个分组匹配from + 空格 + 引号；(?![\.\/]) 第二个分组匹配非./ 也就是模块；最后将第一个分组的内容加上$1/@modules/
    ctx.body = contents
      .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
      .replace(/process\.env\.NODE_ENV/g, '"development"')
  }
})

app.listen(3000)
console.log('Server running @ http://localhost:3000')