/**
 * - 抽取创建 App 模块
 */

const express = require('./express')

const app = express()

app.get('/', (req, res, next) => {
  res.end('get /')
})

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
