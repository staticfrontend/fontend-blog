# React 组件性能优化

React 组件性能优化的核心是减少渲染真实 DOM 节点的频率，减少 Virtual DOM 比对的频率。

## 1. 组件卸载前进行清理操作

在组件中 window 全局事件，定时器等，在组件卸载前要清理掉，防止组件卸载后继续执行影响性能。

* 组件卸载前清除定时器，否则组件卸载后定时器还会执行

```js
function App() {
  useEffect(() => {
    let timer = setInterval(() => {
      console.log('定时器在执行')
    }, 1000)
    // 组件卸载清除定时器
    return () => clearInterval(timer)
  }, [])
}
```

## 2. 纯组件提高组件性能

#### 什么是纯组件

* 纯组件会对组件的props或state进行浅层比较，如果数据没有变化，组件不会重新渲染

#### 什么是浅层比较

* 比较引用类型的数据在内存中的地址是否相同；比较基本类型的数据的值是否相等

#### 如何实现纯组件

* 类组件继承 PureComponent，函数组件使用 memo 方法包裹

```js
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
    // 如果用 Component 则每1秒重新render一次
    console.log('PureComponent render')

    return <div>
      { this.state.name }
    </div>
  }
}
```

## 3. 通过shouldComponentUpdate 生命周期函数提升组件性能

纯组件只能进行浅层比较，要进行深层比较，使用 shouldComponentUpdate.

* shouldComponentUpdate 返回true重新渲染组件，放回false阻止重新渲染

* shouldComponentUpdate 第一个参数为 nextProps，第二个参数为 nextState

如果state 是深层的对象，用纯组件就不起作用了，要使用 shouldComponentUpdate：

```js
class Demo extends React.Component {
  constructor() {
    super()
    this.state = { person: { name: 'react', age: 20 } }
  }
  componentDidMount() {
    setInterval(() => this.setState({ person: { name: 'react', age: 20 } }), 1000)
  }
  render() {
    // 深层对象无变化，setState重复渲染
    console.log('shouldComponentUpdate render')
    return <div>
      { this.state.person.name } { this.state.person.age }
    </div>
  }
}
```

上面的state 是一个深层的state 对象，即使setState 时数据没有发生变化，使用PureComponent也不能阻止重复渲染，要使用 shouldComponentUpdate进行深层比对：

```js
shouldComponentUpdate(nextProps, nextState) {
  // 深层比较
  if (nextState.person.name !== this.state.person.name || nextState.person.age !== this.state.person.age) {
    return true
  }
  return false
}
```

## 4. 为 memo 方法传递自定义比较逻辑

memo 用在函数组件上进行浅层比较，下面的例子中，setPerson 返回的是一个新的对象内存地址，只改变了job的值，但是ShowPerson组件还是会每1s重新渲染一次。

```js
import React, { useState, useEffect, memo } from 'react'

const ShowPerson = memo(function ({ person }) {
  console.log('momo render');
  return (
    <div>
      {person.name} {person.age}
    </div>
  )
})

function Demo() {
  const [person, setPerson] = useState({ name: 'memo', age: 20, job: 'waiter' })

  useEffect(() => {
    setInterval(() => {
      // setPerson 返回一个新的对象内存地址
      setPerson({ ...person, job: 'chef' })
    }, 1000);
  }, [])

  return (
    <div>
      <ShowPerson person={person} />
    </div>
  )
}
```

memo 的第二个参数可以自定义比较逻辑：

```js
function compare(prevProps, nextProps) {
  if (
    prevProps.person.name !== nextProps.person.name || 
    prevProps.person.age !== nextProps.person.age
  ) {
    return false // false 重新渲染，和shouldComponentUpdate相反
  }
  return true
}

const ShowPerson = memo(function ({ person }) {
  return (
    <div>
      {person.name} {person.age}
    </div>
  )
}, compare)
```

这样就防止了不必要的重新渲染了。

## 5. 通过组件懒加载提高性能

使用组件懒加载可以减少 bundle 文件大小。

* 路由组件懒加载

使用react的 lazy, Suspense 方法和es6的 import() 语法实现路由懒加载

```js
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./Home'))
const List = lazy(() => import('./List'))

function App() {
  return(
    <BrowserRouter>
      <link to="/">首页</link>
      <link to="/list">列表页</link>
      <Switch>
        <Suspense fallback={<div>loading...</div>}>
          <Route path="/" component={Home} />
          <Route path="/list" component={List} />
        </Suspense>
      </Switch>
    </BrowserRouter>
  )
}
```

## 6. 使用 Fragment 避免额外标记

react 组件中返回的 jsx 如果有多个同级元素，需要包裹一个标签。但是这样的话会多出来一个无意义标记，如果每个组件都多出来这样一个无意义标记的话，浏览器渲染引擎的负担就会加剧。

* 为了解决这个问题，react 推出了 Fragment 占位符标记，使用占位符包裹了元素又不会多出额外的无意义标记

* Fragment 也可以不用引入，简写为一个空标记 <></> 就可以了

```js
import { Fragment } from 'react'

function App() {
  return <Fragment>
    <div>hello</div>
    <div>react</div>
  </Fragment>
}
```

简写：

```js
import { Fragment } from 'react'

function App() {
  return <>
    <div>hello</div>
    <div>react</div>
  </>
}
```

## 7. 避免使用内联函数提升性能

在使用内联函数后，render 方法每次运行时都会创建该函数的新实例，导致react在进行 Virtrual DOM 比对时，新旧函数比对不相等，导致react总是为元素绑定新的函数实例，旧的函数又要交给垃圾回收器处理。

* 新的函数和旧的函数比对不相等，因为函数是引用数据类型，比较的是内存的引用地址是否相同

* 正确做法是在组件中单独定义函数，将函数绑定给事件

错误做法：

```js
constructor() {
  super()
  this.state = { inputValue: '' }
}
render() {
  return(
    <input onChange={e => this.setState({ inputValue: e.target.value }) } />
  )
}
```

正确做法：

```js
constructor() {
  super()
  this.state = { inputValue: '' }
}
// 正确做法是定义类属性调用，不会产生函数实例
setInputValue = e => {
  this.setState({ inputValue: e.target.value })
}
render() {
  return(
    <input onChange={this.setInputValue} />
  )
}
```

## 8. 在构造函数中进行函数this的绑定

可以在构造函数中对函数的 this 更正指向，也可以在行内进行更正；两者看起来没区别，但是对性能的影响却不同

```js
class App extends React.Component {
  constructor() {
    super()
    // 方式一
    // 构造函数只执行一次，所以函数 this 指向更正的代码也执行一次
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    console.log(this)
  }
  render() {
    // 方式二
    // 问题：render方法每次执行时都会调用bind方法生成新的函数实例
    return <button onClick={this.handleClick.bind(this)}>按钮</button>
  }
}
```

## 9.类组件中的箭头函数

在类组件中使用箭头函数不会存在 this 指向问题，因为箭头函数本身不绑定 this 

箭头函数在 this 的指向问题上占据优势，但同时也有不利的一面

* 当使用箭头函数时，该函数被添加为类的实例对象属性，而不是原型对象属性，如果组件被多次重用，每个组件实例对象中都将会有一个相同的函数实例，降低了函数实例的可重用性造成资源浪费。

综上所述，更正函数内部this执行的最佳方法仍然是在构造函数中使用 bind 方法进行绑定

## 10. 避免使用内联样式属性

当使用内联 style 为元素添加样式时，内联 style 会被编译成js代码，通过js代码又将样式放到元素身上，增加组件的渲染时间。

不使用内联样式，将css文件导入样式组件，能够通过css做的事情就不要通过js去做，因为js操作dom非常慢。

