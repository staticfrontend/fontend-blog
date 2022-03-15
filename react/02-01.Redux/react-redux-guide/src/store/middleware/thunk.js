/**
 * redux-thunk 原理
   • 接收 dispatch, 如果action传递的是函数，则 action(dispatch) 把 dispatch 传递给 action函数，异步代码要写在传递进来的 action 函数中
   • 同步代码调用 next(action) 传递到reducer 中
 */
export default ({ dispatch }) => next => action => {
  // 1. 当前这个中间件函数不关心你想执行什么样的异步操作 只关心你执行的是不是异步操作
  // 2. 如果你执行的是异步操作 你在触发action的时候 给我传递一个函数 如果执行的是同步操作 就传递action对象
  // 3. 异步操作代码要写在你传递进来的函数中
  // 4. 当前这个中间件函数在调用你传递进来的函数时 要将dispatch方法传递过去
  if (typeof action === 'function') {
    return action(dispatch)
  }
  next(action)
}