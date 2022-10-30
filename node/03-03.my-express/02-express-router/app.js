/**
 * - 抽取创建 App 模块
 */

const express = require('./express')

const app = express()

app.get('/', (req, res, next) => {
  res.end('get /')
})

app.get('/foo', (req, res, next) => {
  res.end('get /foo')
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
