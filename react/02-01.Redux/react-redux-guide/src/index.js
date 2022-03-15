/**
 * 1. redux基本使用
    • 1.1 引入createStore创建store容器，传入reducer和中间件
       export const store = createStore(reducer, applyMiddleware(sagaMiddleware));
    • 1.2 reducer 方法里面接收state和action：
       function reducer(state, action) { if (action.type === 'increment') { return { count: state.count + 1 } } // 匹配action.type对state做相应处理 }
    • 1.3 触发action: store.dispatch({ type: 'increment' })
    • 1.4 订阅状态变化：
       store.subscribe(() => { console.log(store.getState()) })

  * 2. redux和react-redux结合
    • 2.1 react-redux提供了Provider和connect
        Provider 可以将 createStore 创建的sotre放在全局，组件就可以拿到store
        connect(mapStateToProps, mapDispatchToProps)(组件)，connect 直接绑定组件：
          通过mapStateToProps可以获取store中的state，然后组件通过props获取state，也可以通过props获取到dispatch => props.dispatch
          通过DispatchToProps可以获取 dispatch 方法
    • 2.2 react-redux的 action 和 reducer 用法和 redux 一样

  * 3. redux中间件
    • 3.1 中间件原理：当组件触发action，被store接收到，store调用中间件，如果有多个中间件，会按照 applyMiddleware 注册的顺序执行中间件；
      第一个中间件执行完后，会调用 next(action) 传递给下一个中间件，下一个中间件调用 next(action) 传递给reducer。
    • 3.2 中间件使用：
        首先 createStore 时使用 redux 中的 applyMiddleware 方法注册中间件：createStore(RootReducer, applyMiddleware(logger))
        然后在中间件里面接收 store, next, action 参数，写成函数柯里化的形式扩展功能，处理中间件最后使用 next(action) 传递给下一个中间件
          export default store => next => action => {
            console.log(store);
            console.log(action);
            next(action);
          }
  * 4. 常用的中间件
    * 4.1 redux-thunk中间件：在action里使用redux-thunk实现异步
    * 4.2 redux-thunk 原理：
        • 源码中：
        export default ({ dispatch }) => next => action => {
          // 接收 dispatch, 如果action传递的是函数，则 action(dispatch) 把 dispatch 传递给 action函数，异步代码要写在传递进来的 action 函数中
          // 同步代码调用 next(action) 传递到reducer 中
          if (typeof action === 'function') {
            return action(dispatch)
          }
          next(action)
        }
        • 调用：多了一个接收 dispatch 的函数，在异步回调里(异步结果后)继续调用diaptch传递给reducer
        export const increment_async = payload => {
          return dispatch => {
            setTimeout(() => {
              dispatch({ type: INCREMENT_ASYNC, payload })
            }, 2000);
          }
        };
    * 4.3 redux-saga中间件：redux-sage 可以将异步操作从 action 文件中抽离出来，放在一个单独的文件中
        • redux-sage的使用：
          takeEvery 接收 action.type
          put 触发 action，传递到reducer；类似于dispatch
    * 4.4 redux-actions中间件：不需要把type写成常量了，省略了type的写法；简化action和reducer的写法

 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.render(
  // 通过provider组件 将 store 放在了全局的组件可以够的到的地方
  <Provider store={store}><App/></Provider>,
  document.getElementById('root')
);

/*
  react-redux
    Provider
    connect
*/