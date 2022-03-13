/**
 * 函数组件或类组件类型返回实例
 * @param {*} fiber 
 */
export const createReactInstance = fiber => {
  let instance = null
  if (fiber.tag === "class_component") {
    instance = new fiber.type(fiber.props)
  } else {
    instance = fiber.type
  }
  return instance
}
