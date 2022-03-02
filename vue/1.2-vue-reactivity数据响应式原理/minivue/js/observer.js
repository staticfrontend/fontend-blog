/**
 * 数据劫持
 * 负责把data选项中的属性转成响应式数据
 * data中的某个属性也是对象，把该属性转成响应式数据
 * 数据变化发送通知
 */
/**
 * 总结：
 * 把data使用Object.defineProperty重写，将属性定义成响应式数据，如果属性值也是对象，递归属性值里的对象为响应式数据
 * 为每一个属性创建一个Dep对象，在getter里面收集依赖，在setter里面通知更新
 */
class Observer {
  constructor (data) {
    this.walk(data)
  }
  walk (data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive (obj, key, val) {
    let that = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    // 如果val是对象，把val内部的属性转换成响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val // 这里val要通过data[key]传递过来，直接使用return data[key]会发生死递归，只用return val本质是闭包
      },
      set (newValue) {
        if (newValue === val) {
          return
        }
        val = newValue
        // 新赋值对象转换成响应式数据
        that.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}