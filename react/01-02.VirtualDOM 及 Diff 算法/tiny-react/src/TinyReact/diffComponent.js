/**
 * 判断React.render()渲染组件的情况下是不是同一个组件
 */
import mountElement from "./mountElement"
import updateComponent from "./updateComponent"

export default function diffComponent(
  virtualDOM,
  oldComponent,
  oldDOM,
  container
) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 组件更新更新组件和旧组件是同一个组件的情况. 做组件更新操作
    updateComponent(virtualDOM, oldComponent, oldDOM, container)
  } else {
    // 不是同一个组件，用mountElement渲染新的组件，移除oldDOM对应的组件
    mountElement(virtualDOM, container, oldDOM)
  }
}
// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
  // 判断组件的构造函数是否相同
  return oldComponent && virtualDOM.type === oldComponent.constructor
}
