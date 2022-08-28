/**
 * nodejs核心模块之Events
 */
const EventEmitter = require('events')
const ev = new EventEmitter()

// on 
ev.on('事件1', () => {
  console.log('on 1')
})
ev.on('事件1', () => {
  console.log('on 2')
})

// emit
ev.emit('事件1')

// once 
ev.once('事件2', () => {
  console.log('once 1 多次触发执行一次')
})
ev.once('事件2', () => {
  console.log('once 2 多次触发执行一次')
})

ev.emit('事件2')
ev.emit('事件2')

// off
let cbFn = (...args) => {
  console.log(args)
}
ev.on('事件3', cbFn)

ev.emit('事件3', 1)
ev.off('事件3', cbFn)
ev.emit('事件3', 1, 2, 3) // off取消cbFn后，emit不再触发
