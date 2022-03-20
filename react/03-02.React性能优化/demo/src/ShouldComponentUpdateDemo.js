import React from 'react'

class Demo extends React.Component {
  constructor() {
    super()
    this.state = { person: { name: 'react', age: 20 } }
  }

  componentDidMount() {
    setInterval(() => this.setState({ person: { name: 'react', age: 20 } }), 1000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 深层比较
    if (nextState.person.name !== this.state.person.name || nextState.person.age !== this.state.person.age) {
      return true
    }
    return false
  }

  render() {
    // 深层对象无变化，setState重复渲染，需加上shouldComponentUpdate深层比对
    console.log('shouldComponentUpdate render')
    
    return <div>
      { this.state.person.name } { this.state.person.age }
    </div>
  }
}

export default Demo