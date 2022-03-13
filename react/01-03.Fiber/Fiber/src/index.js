import React, { render, Component } from "./react"

const root = document.getElementById("root")

// jsx 会被babel进行转换，转换成React.createElement的调用
const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)

// console.log(jsx); // VirtualDOM

// 普通dom节点fiber实现
render(jsx, root)

// 实现更新
setTimeout(() => {
  const jsx = (
    <div>
      <div>奥利给</div>
      <p>Hello</p>
    </div>
  )
  render(jsx, root)
}, 2000)

class Greating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "张三"
    }
  }
  render() {
    return (
      <div>
        {this.props.title}hahahaha {this.state.name}
        <button onClick={() => this.setState({ name: "李四" })}>button</button>
      </div>
    )
  }
}

// 类组件实现
// render(<Greating title="奥利给" />, root)

function FnComponent(props) {
  return <div>{props.title} FnComponent</div>
}

// 函数组件实现
// render(<FnComponent title="Hello" />, root)
