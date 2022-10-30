# express 路由中间件原理

## 实现单个处理函数的中间件功能

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
      return res.end('404 Not Found.');
    }
    
    // 下一个中间件中执行next, index++ 
    const cRoute = this.routes[index++];
    console.log('next', cRoute, index, pathname);

    // 路由路径匹配
    const match = cRoute.path === pathname && cRoute.method === method;
    if (match) {
      // 把下一个next传递给当前路由的handler并执行handler
      return cRoute.handler(req, res, next);
    }

    // 没有匹配到路由路径，递归遍历下一个next
    next();
  }

  next();
}

module.exports = Router

```

总结：在当前的路由中间件函数handler中执行 next, 也就是执行下一个路由的handler

