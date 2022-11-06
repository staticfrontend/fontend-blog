# express 路由中间件原理

## 1. 实现路由中间件的链式调用

```js
const express = require('express')
const app = express()

app.get('/foo', (req, res, next) => {
  console.log('foo 1')
  setTimeout(() => {
    next()
  }, 1000)
})

app.get('/foo', (req, res, next) => {
  console.log('foo 2')
  next()
})

app.get('/foo', (req, res, next) => {
  res.end('get /foo end')
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
```

上面示例中，单个处理函数中使用next，则会继续执行相同路由路径的下一个路由中间件.

那么怎么实现这种 next 执行下一个相同路由中间件的功能呢？

* 思路：next 传递给下一个中间件函数递归调用，使用闭包维护当前的路由索引index；下一个中间件执行 next 时 index++

```js
/**
 * 路由收集和路由路径匹配
 */
const url = require('url')

function Router () {
  this.routes = []
}

// 路由收集
Router.prototype.get = function (path, handler) {
  this.routes.push({
    path,
    method: 'get',
    handler
  })
}

// 路由路径匹配执行对应handle
Router.prototype.handle = function (req, res) {
  /**
   * 路由中间件原理
   */
  const { pathname } = url.parse(req.url)
  const method = req.method.toLowerCase()

  let index = 0;
  const next = () => {
    if (index >= this.routes.length) {
      return res.end('404 Not Found.')
    }
    
    // 下一个中间件中执行next, index++ 
    const cRoute = this.routes[index++]
    console.log('next', cRoute, index, pathname)

    // 路由路径匹配
    const match = cRoute.path === pathname && cRoute.method === method
    if (match) {
      // 把下一个next传递给当前路由的handler并执行handler
      return cRoute.handler(req, res, next)
    }

    // 没有匹配到路由路径，递归遍历下一个next
    next()
  }

  next()
}

module.exports = Router

```

总结：在当前的路由中间件函数handler中执行 next, 也就是执行下一个路由的handler

## 2. app.use 的实现原理

app.use 也是通过 next 实现链式调用：

app.js:

```js
const express = require('./express')

const app = express()

app.use(function (req, res, next) {
  console.log('use 1')
  next()
})
app.use(function (req, res, next) {
  console.log('use 2')
  next()
})
app.use(function (req, res, next) {
  console.log('use 3')
  next()
})

app.get('/', (req, res, next) => {
  res.end('get /')
})
```

<b>app.use 的实现原理也和路由中间件链式调用的实现原理一样</b>

在 App 原型上定义use方法：

express/application.js

```js
...
App.prototype.use = function (path, ...handlers) {
  this._router.use(path, handlers)
}

module.exports = App
```
在 use 原型方法里处理传参，收集 use 中间件：

express/router/index.js

```js
...
Router.prototype.use = function (path, handlers) {
  // 第一个参数不是url路径额外处理
  if (typeof path === 'function') {
    handlers.unshift(path) // 处理函数
    path = '/' // path 为中间件函数，重置 patch 为任何路径
  }

  // 把use中间件当做路由的方式收集
  handlers.forEach(handler => {
    this.routes.push({
      path,
      handler,
      isUseMiddleware: true
    })
  })
}

module.exports = Router
```

在原型方法 handler 里进行路由路径匹配执行中间件函数前，加上 use 中间件的判断：

是否匹配match函数加上 use 中间件的判断逻辑：

```js
function match(cRoute, pathname, method) {
  let match
  if (cRoute.isUseMiddleware) {
    // use 第一个参数为中间件函数的情况：都匹配
    if (cRoute.path === '/') {
      return true
    }
    // use 第一个参数为路径path的情况：只用匹配请求路径是否以path开头
    if (pathname.startsWith(`${cRoute.path}/`)) {
      return true
    }
  } else {
    // 路由路径匹配
    match = cRoute.path === pathname && cRoute.method === method
  }
  return match
}
```