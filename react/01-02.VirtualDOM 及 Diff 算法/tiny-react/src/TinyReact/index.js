/**
 *  React VirtualDom原理及渲染原理
 *  1. JSX经过@babel/preset-react编译成React.createElement的js调用
       createElement会把真实dom转换为virtualDom，返回 { type, props, children }
    2. 渲染原理：React.render会将virtualDom转为真实dom添加到页面中 =》 TinyReact.render(virtualDOM, root)
      • 初始化的时候会调用mountElement，mountElement会判断virtualDOM.type是否是函数
      • 如果是函数，则调用mountComponent；否则为普通dom元素，调用mountNativeElement
      • mountNativeElement负责将普通dom元素转为真实dom：如果virtualDOM.type === "text"则调用document.createTextNode(virtualDOM.props.textContent)渲染文本节点；
        否则是元素节点调用document.createElement(virtualDOM.type)；并且遍历子节点virtualDOM.children递归调用mountElement创建。
      • mountComponent负责渲染函数组件和类组件：函数组件和类组件都在virtualDOM.type上，
        函数组件直接调用virtualDom.type()拿到virtualDom然后使用mountNativeElement渲染；
        类组件new virtrualDom.type()然后调用实例的render()拿到virtualDom然后使用mountNativeElement渲染；
    3. React.Component的实现：
      • 在Component里的constructor(props){ this.props = props }，接收子类super(props)传递过来的props放到this上，这样子类就可以直接使用this.props了
      
 */

import createElement from "./createElement"
import render from "./render"
import Component from "./Component"

export default {
  createElement,
  render,
  Component
}
