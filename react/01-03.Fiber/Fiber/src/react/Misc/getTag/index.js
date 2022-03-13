/**
 * 返回节点类型
 */
import { Component } from "../../Component"

const getTag = vdom => {
  if (typeof vdom.type === "string") {
    // 普通节点类型
    return "host_component"
  } else if (Object.getPrototypeOf(vdom.type) === Component) {
    // 类组件类型
    return "class_component"
  } else {
    // 函数组件类型
    return "function_component"
  }
}
export default getTag
