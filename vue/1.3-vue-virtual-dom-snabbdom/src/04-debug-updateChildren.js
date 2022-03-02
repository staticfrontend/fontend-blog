/**
 * snabbdom源码的核心
    init()设置模块，并创建patch() 函数
    使用h() 函数创建JS对象(VNode)描述真实dom
    patch() 比较新旧两个vnode
    把变化的内容更新到真实dom树
 */

import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

let patch = init([])

// 首次渲染
let vnode = h('ul', [
  h('li', '首页'),
  h('li', '视频'),
  h('li', '微博')
])
let app = document.querySelector('#app')
let oldVnode = patch(app, vnode)

// updateChildren 的执行过程
vnode = h('ul', [
  h('li', '首页'),
  h('li', '微博'),
  h('li', '视频')
])
patch(oldVnode, vnode)
