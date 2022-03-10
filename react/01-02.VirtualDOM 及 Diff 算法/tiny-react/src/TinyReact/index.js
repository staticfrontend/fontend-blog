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
    3. React.Component的和setState实现：
      • 在Component里的constructor(props){ this.props = props }，接收子类super(props)传递过来的props放到this上，这样子类就可以直接使用this.props了
      • setState实现类组件更新：
          1-在Component中，定义setState(state){ this.state = Object.assign({}, this.state, state) } 接收子组件传递过来的state
          2-在子组件调用this.setState时候，将传递的state和原有的this.state进行合并，改变this.state也就是改变子类的this.state(在子类中调用this.setState，this此时指向子类实例)
          3-在setState，重新触发this.render方法，获取渲染的新的virtualDOM 对象
          4-diff(virtualDOM, container, oldDOM) 将新的vitrualDom和旧的进行diff比对，更新组件
      • 生命周期函数在这里面定义
        shouldComponentUpdate(nextProps, nextState) {
          return nextProps != this.props || nextState != this.state
        }
        shouldComponentUpdate生命周期函数里面会比对nextProps和this.props或者nextState和this.state是否相等
    4. Diff算法：react中的diff算法和vue中的类似
      • 普通虚拟dom的对比和vue中dom-diff对比类似（也就是组件内dom-diff）
      • 如果typeof virturlDom.type === 'funciton'是组件，则进行组件的比对diffComponent
          1-组件更新，更新组件和旧组件是同一个组件的情况. 做组件更新操作；不是同一个组件，用mountElement渲染新的组件，移除旧的组件
          2-组件更新操作：组件更新在updateComponent(virtualDOM,oldComponent,oldDOM,container)函数中
            2-01-在oldComponent.shouldComponentUpdate(virtualDOM.props)传入新组件的props；
            2-02-shouldComponentUpdate会将传入的新旧props进行比对，返回布尔值，如果是true，则updateProps(virtualDOM.props)并调用oldComponent.render()，然后diff比对更新；
            2-03-更新后会调用oldComponent.componentDidUpdate(prevProps)生命周期函数
    5. ref的原理：
      • ref如果是放在组件上，在组件实例化后，调用ref方法传入组件实例
      • ref如果是放在节点属性上，调用节点上的ref方法，传入当前真实dom节点
    6. key的作用：key 属性就是数据的唯一标识，帮助 React 识别哪些数据被修改或者删除了
      
        
 */

import createElement from "./createElement"
import render from "./render"
import Component from "./Component"

export default {
  createElement,
  render,
  Component
}
