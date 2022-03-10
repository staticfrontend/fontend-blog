/**
 * 创建普通virtualDom为真实dom
 */
import mountElement from "./mountElement"
import updateNodeElement from "./updateNodeElement"

export default function createDOMElement(virtualDOM) {
  let newElement = null
  if (virtualDOM.type === "text") {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type)
    updateNodeElement(newElement, virtualDOM)
  }

  newElement._virtualDOM = virtualDOM

  // 递归创建子节点
  virtualDOM.children.forEach(child => {
    mountElement(child, newElement)
  })

  // ref如果是放在节点属性上，调用节点上的ref方法，并且把当前节点作为参数传递给ref
  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(newElement)
  }

  return newElement
}
