# Node核心模块之Events

## 1. EventEmitter

### 1.1 events与EventEmitter

* nodejs是基于事件驱动的异步操作架构，内置events 模块

* events 模块提供了 EventEmitter 类

### 1.2 EventEmitter 常见API

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

### 1.3 EventEmitter 与发布订阅模式

* 发布订阅模式存在调度中心，而观察者模式没有调度中心

<img src="https://user-images.githubusercontent.com/20060839/187077724-c3e6f3f4-fdf9-4a1c-ab34-19335eed6eb1.png"/>

发布订阅模式要素：

* 缓存队列，存放订阅者信息

* 具有增加、删除订阅能力

* 状态改变时通知所有的订阅者执行监听

### 1.4 EventEmitter 实现

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

### 2.1 浏览器中的Eventloop

完整的事件环执行顺序：

* 执行同步代码，将宏任务和微任务放入相应的队列

* 每一次宏任务同步代码执行后，执行满足条件的微任务

* 微任务队列执行后，执行满足条件的宏任务异步代码

* 循环事件环操作

注意：宏任务队列中每执行一个宏任务后，会执行一次微任务

```js
setTimeout(() => {
  console.log('s1')
  Promise.resolve().then(() => {
    console.log('p2')
  })
  Promise.resolve().then(() => {
    console.log('p3')
  })
})

Promise.resolve().then(() => {
  console.log('p1')
  setTimeout(() => {
    console.log('s2')
  })
  setTimeout(() => {
    console.log('s3')
  })
})
```

输出结果为：

p1 s1 p2 p3 s2 s3

### 2.2 Nodejs 中的Eventloop

#### 2.1.1 Nodejs 事件循环队列

事件队列的执行顺序如下：

<img src="https://user-images.githubusercontent.com/23166885/187464617-864f844b-c8bf-41ac-ab6f-a6849c281aa7.png"/>

6个事件队列说明：

* timers： 执行setTimeout和setInterval回调

* pending callbacks： 执行系统操作的回调，如tcp

* idle prepare：系统内部使用

* poll：I/O 相关回调

* check：执行setImmediate

* close callbacks：close事件的回调

常用的有timers, check 事件

#### 2.1.2 Nodejs Eventloop

Nodejs 完整的事件环执行顺序：

* 执行同步代码，将不同任务放入相应的队列

* 每一次宏任务同步代码执行后，执行满足条件的微任务

* 微任务队列执行后，执行满足条件的 timer 队列中满足条件的宏任务

* timer 队列中宏任务执行完后，会依次按照 pending callbacks、idle prepare、poll、check、close callbacks 的顺序切换队列

* 循环事件环操作

注意：宏任务队列中的每一个宏任务执行完成后，才会执行一次微任务

```js
// timers 事件队列
setTimeout(() => {
  console.log('s1')
})

Promise.resolve().then(() => {
  console.log('p1')
})

console.log('start')

process.nextTick(() => {
  console.log('tick')
})

// setImmediate 属于 check 事件队列
setImmediate(() => {
  console.log('setimmediate')
})

console.log('end')
```

输出结果为：

start, end, tick, p1, s1, setimmediate

### 2.3 Nodejs 与浏览器事件循环的区别

* 1.任务队列数不同

* 2.Nodejs 微任务执行时机不同

* 3.微任务优先级不同

#### 任务队列数

* 浏览器中只有两个任务队列

* Nodejs 中有6个事件队列

#### 微任务执行时机

* 两者都会在同步代码执行完毕后执行微任务

* 浏览器中每一个宏任务执行完毕后就清空微任务；Nodejs 中在事件队列所有任务执行完毕后，切换时才会清空微任务

#### 微任务优先级不同

* 浏览器事件环中，微任务存放于事件队列，先进先出

* Nodejs 中process.nextTick 先与 Promise.then

```js
setTimeout(() => {
  // Nodejs 中在事件队列所有任务执行完毕后，切换时才会清空微任务
  // 所以需要先把s1, s2任务执行后，才执行微任务，并且nextTick优于Promise
  console.log('s1')
  Promise.resolve().then(() => {
    console.log('p1')
  })
  process.nextTick(() => {
    console.log('t1')
  })
})

Promise.resolve().then(() => {
  console.log('p2')
})

console.log('start')

setTimeout(() => {
  console.log('s2')
  Promise.resolve().then(() => {
    console.log('p3')
  })
  process.nextTick(() => {
    console.log('t2')
  })
})

console.log('end')
```

nodejs 运行结果：

start, end, p2, s1, s2, t1, t2, p1, p3

浏览器运行结果：

start, end, p2, s1, p1, t1, s2, p3, t2

