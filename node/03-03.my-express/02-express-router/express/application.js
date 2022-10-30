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