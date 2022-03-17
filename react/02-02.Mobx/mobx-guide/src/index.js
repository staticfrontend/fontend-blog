/**
 * Mobx
 * mobx的基本使用
    • 1.创建用于存储状态的 Store
      export default CounterStore {
        constructor() {
          this.count = 0
        }
      }
    • 2.创建用于修改状态的方法
      export default CounterStore {
        constructor() {
          this.count = 0
        }
        increment() {
          this.count += 1
        }
      }
    • 3.让mobx可以追踪状态的变化
        3.1 通过makeObservable 标识状态和方法；observable 标识状态，使状态可观察
        3.2 通过action标识修改状态的方法，状态只有通过action方法修改后才会通知视图更新
      import { action, makeObservable, observable } from 'mobx';
      export default class CounterStore {
        constructor() {
          this.count = 0
          makeObservable(this, {
            count: observable, // observable标识状态
            increment: action // action标识方法
          })
        }
        increment() {
          this.count += 1
        }
      }
    • 4.创建Store类的实例对象并将实例对象传递给组件
      import Counter from './Counter
      import CounterStore from './stores/Counter

      const counterStore = new CounterStore()

      function App() {
        return <Counter counterStore ={counterStore} />
      }

      export defalut App
    • 5.在组件中通过Store实例对象获取状态及操作状态的方法
      function Counter({ counterStore }) {
        return (
          <div>
            <p className="paragraph">{counterStore.count}</p>
            <button onClick={() => counterStore.increment()} className="button">加 1</button>
          </div>
        )
      }
    • 6.当组件中使用到的 Mobx 管理的状态发生变化后，通知视图更新，通过 observer 方法包裹组件
      import { observer } from 'mobx-react-lite'

      function Counter() {}
      export default observer(Counter)

  * 总结 Mobx 核心：
    • 状态在 makeObservable 方法里用 observable 标记为 observable state
    • 更改状态的方法用 action 标记为 action 方法
    • 组件视图通过 observer 方法包裹，状态发生变化后，通知组件视图更新
    
 */
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./index.css"

ReactDOM.render(<App />, document.getElementById("root"))
