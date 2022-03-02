import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

const patch = init([])

// 包含子元素的vnode
let vnode = h('div#container', [
  h('h1', 'Hello Snabbdom'),
  h('p', '这是一个p标签')
])

let app = document.querySelector('#app')
let oldVnode = patch(app, vnode)

setTimeout(() => {
  // 重新创建新的vnode，显示新的内容
  vnode = h('div#container', [
    h('h1', 'Hello World'),
    h('p', 'Hello P')
  ])
  // 对比两个vnode的差异，把差异更新到页面
  patch(oldVnode, vnode)

  // 清除div中的内容 
  // patch(oldVnode, h('!'))
}, 2000);