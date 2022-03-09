/**
 * React.Component实现
 */
import diff from "./diff"

export default class Component {
  constructor(props) {
    // 接收子类super(props)传递过来的props放到this上，这样子类就可以直接使用this.props了
    this.props = props
  }
  setState(state) {
    // 将传递的state和原有的this.state进行合并，改变this.state也就是改变子类的this.state(在子类中调用this.setState，this指向子类实例)
    this.state = Object.assign({}, this.state, state)
    // 当state改变，重新触发render方法，获取渲染的新的virtualDOM 对象
    let virtualDOM = this.render()
    // 获取旧的 virtualDOM 对象 进行比对
    let oldDOM = this.getDOM()
    // 获取容器
    let container = oldDOM.parentNode
    // 将新的virtualDOM和旧的oldVirtualDOM进行对比更新
    diff(virtualDOM, container, oldDOM)
  }
  setDOM(dom) {
    this._dom = dom
  }
  getDOM() {
    return this._dom
  }
  updateProps(props) {
    this.props = props
  }

  // 生命周期函数
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, preState) {}
  componentWillUnmount() {}
}
