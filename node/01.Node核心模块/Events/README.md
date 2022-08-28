# Node核心模块之Events

## 1. EventEmitter

#### 1.1 events与EventEmitter

* nodejs是基于事件驱动的异步操作架构，内置events 模块

* events 模块提供了 EventEmitter 类

#### 1.2 EventEmitter 常见API

* on: 添加当事件被触发时调用的回调函数

* emit: 触发事件，按照注册的回调函数顺序调用每个事件监听器

* once: 添加当事件首次被触发时调用的回调函数

* off: 移除某个事件监听器

on:

```js
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
```

once:

```js
// once 
ev.once('事件2', () => {
  console.log('once 1 多次触发执行一次')
})
ev.once('事件2', () => {
  console.log('once 2 多次触发执行一次')
})

ev.emit('事件2')
ev.emit('事件2')
```

off：
```js
let cbFn = (...args) => {
  console.log(args)
}
ev.on('事件3', cbFn)

ev.emit('事件3', 1)
ev.off('事件3', cbFn) // 取消cbFn
ev.emit('事件3', 1, 2, 3) // off取消cbFn后，emit不再触发
```

#### 1.3 EventEmitter 与发布订阅模式

* 发布订阅模式存在调度中心，而观察者模式没有调度中心

<img src="https://user-images.githubusercontent.com/20060839/187077724-c3e6f3f4-fdf9-4a1c-ab34-19335eed6eb1.png"/>

发布订阅模式要素：

* 缓存队列，存放订阅者信息

* 具有增加、删除订阅能力

* 状态改变时通知所有的订阅者执行监听

#### 1.4 EventEmitter 实现

```js
function MyEvent () {
  // 准备一个数据结构用于缓存订阅者信息
  this._events = Object.create(null)
}

MyEvent.prototype.on = function (type, callback) {
  // 判断当前次的事件是否已经存在，然后再决定如何做缓存
  if (this._events[type]) {
    this._events[type].push(callback)
  } else {
    this._events[type] = [callback]
  }
}

MyEvent.prototype.emit = function (type, ...args) {
  if (this._events && this._events[type].length) {
    this._events[type].forEach((callback) => {
      callback.call(this, ...args)
    })
  }
}

MyEvent.prototype.off = function (type, callback) {
  // 判断当前 type 事件监听是否存在，如果存在则取消指定的监听
  if (this._events && this._events[type]) {
    this._events[type] = this._events[type].filter((item) => {
      return item !== callback && item.link !== callback
    })
  }
}

MyEvent.prototype.once = function (type, callback) {
  let foo = function (...args) {
    callback.call(this, ...args)
    this.off(type, foo)
  }
  foo.link = callback
  // 先on再off
  this.on(type, foo)
}

let ev = new MyEvent()

let fn = function (...data) {
  console.log('事件1执行了', data)
}

/* ev.on('事件1', fn)
ev.on('事件1', () => {
  console.log('事件1----2')
})

ev.emit('事件1', 1, 2)
ev.emit('事件1', 1, 2) */

/* ev.on('事件1', fn)
ev.emit('事件1', '前')
ev.off('事件1', fn)
ev.emit('事件1', '后') */

ev.once('事件1', fn)
// ev.off('事件1', fn)
ev.emit('事件1', '前')
```

## 2. Eventloop 事件环