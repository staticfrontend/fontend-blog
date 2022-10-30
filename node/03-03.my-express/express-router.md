# express 路由原理

## 1.基本原理

express路由的原理：

app.js 定义路由:

```js
const express = require('./express')

const app = express()

app.get('/', (req, res) => {
  res.end('get /')
})

app.get('/about', (req, res) => {
  res.end('get /about')
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
```

* 1. 在express中使用get方法将路由收集:

express/index.js

```js
// 收集实例注册的路由
const routes = [
  // { path: '', method: '', handler: () => {} }
]

function createApplication () {
  return {
    // 把路由收集起来
    get (path, handler) {
      routes.push({
        path,
        method: 'get',
        handler
      })
    },
  }
}

module.exports = createApplication
```

* 2. http.createServer 创建服务器, 每次进入http.createServer 通过解析 req.url, 命中routes中的路由路径, 然后传入req, res 执行 handler(req, res)

```js
const http = require('http')
const url = require('url')

// 收集实例注册的路由
const routes = []

function createApplication () {
  return {
    // 把路由收集起来
    get (path, handler) {
      ...
    },
    listen (...args) {
      const server = http.createServer((req, res) => {
        const { pathname } = url.parse(req.url)
        const method = req.method.toLowerCase()
        const route = routes.find(route => route.path === pathname && route.method === method)
        if (route) {
          return route.handler(req, res)
        }
        res.end('404 Not Found.')
      })
      server.listen(...args)
    }
  }
}
```

## 2.抽离路由模块

把路由相关逻辑抽离到路由模块：

express/router/index.js

```js
const url = require('url')

function Router () {
  this.routes = []
}

// 收集路由
Router.prototype.get = function (path, handler) {
  this.routes.push({
    path,
    method: 'get',
    handler
  })
}

// 路由路径匹配执行对应handle
Router.prototype.handle = function (req, res) {
  const { pathname } = url.parse(req.url)
  const method = req.method.toLowerCase()
  const route = this.routes.find(route => route.path === pathname && route.method === method)
  if (route) {
    return route.handler(req, res)
  }
  res.end('404 Not Found.')
}

module.exports = Router


```

然后调用路由模块收集路由和执行路由监听：

```js
const http = require('http')
const Router = require('./router')

function App () {
  this._router = new Router()
  // this.routes = []
}

App.prototype.get = function (path, handler) {
  // 调用get使用路由模块收集路由
  this._router.get(path, handler)
}

App.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    // 请求进入交给路由模块的handle处理
    this._router.handle(req, res)
  })
  server.listen(...args)
}

module.exports = App
```

