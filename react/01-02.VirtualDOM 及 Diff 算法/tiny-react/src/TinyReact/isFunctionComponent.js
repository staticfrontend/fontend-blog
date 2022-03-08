/**
 * 是否为函数组件
 */
import isFunction from "./isFunction"

export default function isFunctionComponent(virtualDOM) {
  const type = virtualDOM.type
  return (
    type && isFunction(virtualDOM) && !(type.prototype && type.prototype.render)
  )
}
