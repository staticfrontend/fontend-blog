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
  /*
  const { pathname } = url.parse(req.url)
  const method = req.method.toLowerCase()
  const route = this.routes.find(route => route.path === pathname && route.method === method)
  if (route) {
    return route.handler(req, res)
  }
  res.end('404 Not Found.')
  **/

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
