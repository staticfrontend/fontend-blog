#!/usr/bin/env node
/**
 * Vite
 * Vite 和 Vue-cli
      1.vite在本地开发模式下不需要打包就可以直接运行：因为在开发模式下vite使用浏览器原生支持的esmodule加载模块，也就是通过
      import来导入模块，支持esmodule的现代浏览器通过<script type="module"></script>的方式加载模块代码；因为vite不需要
      打包项目，因此vite在开发模式下打开页面时秒开的；
      2.而vue-cli在开发模式下会先打包整个项目，项目大速度会很慢
      3.vite的实现方式(原理)：开启一个测试服务器，拦截浏览器发送的请求，vite会对浏览器不识别的模块进行处理，比如import单文件组件时，会在服务器上
      对.vue文件进行编译，把编译的结果返回给浏览器
  * Vite的优点
    快速冷启动：因为不需要打包
    按需编译：只有当代码需要加载的时候，才会编译，不需要在开启开发服务器等待整个项目被打包
    模块热更新
    vite在生产环境下使用rollup打包：基于ES Module的方式打包，不需要再转换import，所以打包体积会比webpackd打包体积更小
  * Vite的使用
    vite创建vue3项目：
      npm init vite-app <project-name>
 */

// 下面为vite的简单实现
const path = require('path')
const { Readable, crea } = require('stream')
const Koa = require('koa')
const send = require('koa-send')
const compiler = require('@vue/compiler-sfc')

// 获取当前执行 node 的目录
const cwd = process.cwd()

const app = new Koa()

const streamToString = stream => new Promise((resolve, reject) => {
  const chunks = []
  stream.on('data', chunk => chunks.push(chunk))
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  stream.on('error', reject)
})

const stringToStream = text => {
  const stream = new Readable()
  stream.push(text)
  // 设置null，代表这个流结束
  stream.push(null)
  return stream
}

// 3. 重写请求路径，/@modules/xxx => /node_modules/
app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/@modules/')) {
    const moduleName = ctx.path.substr(10) // => vue
    // 加载包中的 package.json 文件
    const modulePkg = require(path.join(cwd, 'node_modules', moduleName, 'package.json'))
    // 加载 package.json 中指定的 module 模块路径
    ctx.path = path.join('/node_modules', moduleName, modulePkg.module)
  }
  await next()
})

// 1. 实现静态服务器
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, { root: cwd, index: 'index.html' })
  await next()
})

// 4. .vue 文件请求的处理，即时编译
app.use(async (ctx, next) => {
  if (ctx.path.endsWith('.vue')) {
    const contents = await streamToString(ctx.body)
    const { descriptor } = compiler.parse(contents)
    let code

    if (ctx.query.type === undefined) {
      code = descriptor.script.content
      code = code.replace(/export\s+default\s+/, 'const __script = ')
      code += `
import { render as __render } from "${ctx.path}?type=template"
__script.render = __render
console.log('haha')
export default __script
      `
    } else if (ctx.query.type === 'template') {
      const templateRender = compiler.compileTemplate({ source: descriptor.template.content })
      code = templateRender.code
    }
    ctx.type = 'application/javascript'
    ctx.body = stringToStream(code)
  }
  await next()
})

// 2. 在把内容返回给浏览器之前，替换代码中特殊位置
app.use(async (ctx, next) => {
  if (ctx.type === 'application/javascript') {
    const contents = await streamToString(ctx.body)
    ctx.body = contents
      // 非获取匹配，正向否定预查，在任何不匹配pattern的字符串开始处匹配查找字符串，该匹配不需要获取供以后使用。例如“Windows(?!95|98|NT|2000)”能匹配“Windows3.1”中的“Windows”，但不能匹配“Windows2000”中的“Windows”。
      // import vue from 'vue' ---> import vue from '/@modules/vue'
      // import db from '../db/index' ---> import db from '../db/index'
      .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
      .replace(/process\.env\.NODE_ENV/g, '"development"')
  }
})

app.listen(3080)

console.log('Server running @ http://localhost:3080')

// 读取流中的字符串
// const streamToString = stream => new Promise((resolve, reject) => {
//   const chunks = []
//   stream.on('data', chunk => chunk.push(chunk))
// })
