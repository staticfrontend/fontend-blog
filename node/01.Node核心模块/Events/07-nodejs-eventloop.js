/**
 * Nodejs 与浏览器事件循环的区别
 */
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

// start, end, p2, s1, s2, t1, t2, p1, p3 // nodejs 运行结果
// start, end, p2, s1, p1, t1, s2, p3, t2 // 浏览器运行结果