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
  const { pathname } = url.parse(req.url)
  const method = req.method.toLowerCase()
  const route = this.routes.find(route => route.path === pathname && route.method === method)
  if (route) {
    return route.handler(req, res)
  }
  res.end('404 Not Found.')
}

module.exports = Router
