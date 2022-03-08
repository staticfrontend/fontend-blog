/**
 * 判断是组件，调用mountComponent渲染；是普通virtualDom，调用mountNativeElement渲染
 */
import mountNativeElement from "./mountNativeElement"
import isFunction from "./isFunction"
import mountComponent from "./mountComponent"

export default function mountElement(virtualDOM, container, oldDOM) {
  if (isFunction(virtualDOM)) {
    // Component
    mountComponent(virtualDOM, container, oldDOM)
  } else {
    // NativeElement
    mountNativeElement(virtualDOM, container, oldDOM)
  }
}
