/**
 *  React Hooks：对函数型组件进⾏增强
     对函数型组件进⾏增强, 让函数型组件可以存储状态, 可以拥有处理副作⽤的能⼒.
     让开发者在不使⽤类组件的情况下, 实现相同的功能
 *  1. 类组件的不⾜ (Hooks 要解决的问题)
      • 缺少逻辑复⽤机制
      • 在⼀个⽣命周期函数内存在多个不相⼲的业务逻辑
    2.React Hooks 使⽤
      Hooks 意为钩⼦, React Hooks 就是⼀堆钩⼦函数, React 通过这些钩⼦函数对函数型组件进⾏增强, 不同的钩⼦函数提供了不同的功能.
      • useState()
      • useEffects()
      • useReducer()
      • useRef()
      • useCallback()
      • useContext()
      • useMemo()
    2.1 useState()
      • ⽤于为函数组件引⼊状态
      • 设置状态值⽅法的参数可以是⼀个值也可以是⼀个函数，设置状态值⽅法的⽅法本身是异步的

        import React, { useState } from 'react'
        function App() {
          // 接收唯⼀的参数即状态初始值. 初始值可以是任意数据类型
          // 返回值为数组. 数组中存储状态值和更改状态值的⽅法. ⽅法名称约定以set开头, 后⾯加上状态名称
          const [count, setCount] = useState(0)

          // setCount⽅法可以被调⽤多次. ⽤以保存不同状态值.
          return <div>
            <span>{ count }</span>
            <button onClick={() => setCount(count + 1)}>加</button>
          </div>
        }

    2.2 useReducer 钩⼦函数
      • useReducer是另⼀种让函数组件保存状态的⽅式，使用方式和redux很相似

        import React, { useReducer } from 'react'

        function reducer(state, action) {
          switch(action.type) {
            case 'increment': return state + 1
          }
        }
        function App() {
          const [count, dispatch] = useReducer(reducer, 0)

          return <div>
            <span>{ count }</span>
            <button onClick={() => dispatch({ type: 'increment' }}>加</button>
          </div>
        }

    2.3 useContext 钩⼦函数
      • 跨组件传递数据
      import React, { createContext } from 'react'

      const countContext = createContext()
      function App() {
        return <countContext.Provider value={100}>
          <Foo />
        </countContext.Provider>
      }

      function Foo() {
        // 在使用useContext前使用countContext.Consumer
        return <countContext.Consumer>{ value => return <div>{value}</div> }</countContext.Consumer>
      }

      function Foo() {
        // 使用useContext 简化
        const value = useContext(countContext)
        return <div>{value}</div>
      }
    
    2.4 useEffect 钩⼦函数
      • 让函数型组件拥有处理副作⽤的能⼒. 类似⽣命周期函数.

      6.1 useEffect 执⾏时机
        可以把 useEffect 看做 componentDidMount, componentDidUpdate 和 componentWillUnmount 这三个函数的组合.
        • useEffect(() => {}) => 执行componentDidMount, componentDidUpdate
        • useEffect(() => {}, []) 后面多一个参数[] => 执行componentDidMount
        • useEffect(() => () => {}) 回调函数里再执行一个函数 => 执行componentWillUnMount
      6.2 useEffect 解决的问题
        • useEffect 可以多次调用，所以可以将不同的功能的代码写在不同的 useEffect 中
      6.3 useEffect 只在指定数据发生变化时触发effect
        useEffect(() => {
          document.title = count
        }, [count]) // 传递第二个参数，指定监测的数据
      6.4 useEffect 结合异步函数
        useEffect中的参数函数不能是异步函数, 因为useEffect函数要返回清理资源的函数, 如果是异步函数就变成了返回Promise
        userEffect(() => {
          // 使用匿名函数自执行使用async，不能把async放在userEffect的参数上
          (async () => {
            await axios.get();
          })()
        })
    
    2.5 useMemo 钩子函数
      • useMemo 的⾏为类似Vue中的计算属性, 可以监测某个值的变化, 根据变化值计算新值.
      • useMemo 会缓存计算结果. 如果监测值没有发⽣变化, 即使组件重新渲染, 也不会重新计算. 此⾏为可以有助于避免在每个渲染上进⾏昂贵的计算.

      useMemo两个参数，第一个参数为回调函数用来计算新值，第二个参数为要监测的值；当要监测的值发生变化时，回调函数会重新执行，返回值为计算出来的新值

        import { useState, useMemo } from 'react'
        const [count, setCount] = useState(0)
        // 当count发生变化，result也会变化；当count没有变化，回调函数不会重新计算取缓存值
        const result = useMemo(() => {
          return count * 2;
        }, [count])

    2.6 使用memo方法提高组件性能
      • 性能优化：如果本组件中的数据没有发⽣变化, 阻⽌组件更新. 类似类组件中的 PureComponent 和 shouldComponentUpdate
      直接使用memo包裹组件：
        import { memo } from 'react'
        function Counter() {
        }
        export default memo(Counter)

    2.7 useCallback 钩⼦函数
      • 性能优化：缓存函数, 使组件重新渲染时得到相同的函数实例
        useCallback第一个参数为回调函数，第二个参数为要监听的函数

          import React, { useCallback } from 'react'

          function Counter() {
            const [count, setCount] = useState(0)
            
            // const resetCount = setCount(0) // setCount 传递给子组件，需要缓存；否则每次count 重新发生变化，setCount返回值为不同函数
            const resetCount = useCallback(() => setCount(0), [setCount]); // 监测setCount，更新resetCount
            return (<div>
              <span>{ count }</span>
              <button onClick={() => setCount(count + 1)}>加</button>
              <Foo resetCount={resetCount} />
            </div>)
          }

          function Foo(props) {
            console.log('Foo重新渲染了')
            return(<div>
              <button onClick={() => props.resetCount()}>重置为0</button>
            </div>)
          }

    2.8 useRef 钩⼦函数
      • 获取 DOM 元素
        function App() {
          const username = useRef()
          const handle = () => console.log(username) // { current: input }
          return <input ref={username} onChange={handle} />
        }
      • 保存数据 (跨组件周期)：
        跨组件周期是指即使组件重新渲染, 保存的数据仍然还在；
        useRef 保存的数据和 useState 是有区别的：useState 保存的数据是状态数据，当数据改变组件重新渲染；而 useRef 保存的数据被更改不会触发组件重新渲染.

  * 3. ⾃定义 Hook
    • ⾃定义 Hook 是标准的封装和共享逻辑的⽅式
    • ⾃定义 Hook 是⼀个函数, 其名称以 use 开头
    • ⾃定义 Hook 其实就是自己的逻辑和内置 Hook 的组合
    示例：见代码 UseHooksDemo.js或UseFormInput.js

  * 4. useState 实现原理
    • useState(initialState) 接收一个initialState 初始值，用state 数组保存；数组有一个下标index，每调用一次useState，index ++
    • createSetter(index) 创建设置状态的方法. 例如在组件调用setCount(count + 1)，createSetter利用闭包保存了index，并且返回值为一个函数接收newState (count + 1)
      然后利用保存的下标设置对应state的值(state[index] = newState)，然后调用render() 更新视图
    • useState 返回一个数组，数组的第一个值是状态state[index]，第二个值是设置状态的方法createSetter(index)

  * 5. useEffect 实现原理
    主要是通过比较第二个数组参数的对应索引的值是否变化来调用callback
    • useEffect(callback, depsAry) 如果depsAry没传，直接调用回调callback；如果传了depsAry，把depsAry用prevDepsAry保存起来，下一次render重新调用useEffect，
      比较depsAry用prevDepsAry，对应索引的值不相等，则调用callback
  
  * 6. useReducer 实现原理
    • useReducer (reducer, initialState) 调用 useReducer会传递 reducer 和 initialState 两个参数，传入的reducer(state, action) 返回新的state；
    • 在useReducer 里用 useState 将initialState 转为状态数据 => const [state, setState] = useState(initialState)
    • function dispatch(action) { 
        const newState = reducer(state, action);
        setState(newState)
      }
      在dispatch 方法触发时传入状态数据state 和action，返回一个新的state，然后setState 更新视图
    • 最后返回 [state, dispatch]
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
