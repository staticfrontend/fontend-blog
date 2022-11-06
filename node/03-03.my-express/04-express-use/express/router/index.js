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

// 路由路径匹配执行对应handle
Router.prototype.handle = function (req, res) {
  /**
   * 中间件原理
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

    const ismatch = match(cRoute, pathname, method);
    if (ismatch) {
      // 把下一个next传递给当前路由的handler并执行handler
      return cRoute.handler(req, res, next);
    }

    // 没有匹配到路由路径，递归遍历下一个next
    next();
  }

  next();
}

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
