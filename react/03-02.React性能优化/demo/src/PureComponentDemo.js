/**
 * 如果用Component 则会一直重复渲染
 */
import React from 'react'

class Demo extends React.PureComponent {
  constructor() {
    super()
    this.state = { name: 'react', age: 20 }
  }

  componentDidMount() {
    setInterval(() => this.setState({ name: 'react' }), 1000)
  }

  render() {
    // 使用PureComponent 会对state 进行浅层比较（state 第一层属性值进行比较），数据没有变化，不会重新渲染render
    console.log('PureComponent render');
    
    return <div>
      { this.state.name }
    </div>
  }
}

export default Demo