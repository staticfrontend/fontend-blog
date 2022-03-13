/**
 * 将fiber对象转成真实dom
 */
import { createDOMElement } from "../../DOM"
import { createReactInstance } from "../createReactInstance"

const createStateNode = fiber => {
  if (fiber.tag === "host_component") {
    // 普通节点类型生成真实dom
    return createDOMElement(fiber)
  } else {
    // 函数组件或类组件类型返回实例
    return createReactInstance(fiber)
  }
}

export default createStateNode
