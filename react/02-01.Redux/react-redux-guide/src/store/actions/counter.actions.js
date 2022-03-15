import { INCREMENT, DECREMENT, INCREMENT_ASYNC } from "../const/counter.const";

export const increment = payload => ({type: INCREMENT, payload});
export const decrement = payload => ({type: DECREMENT, payload});

// 1.实现异步方式一：使用redux-thunk：接收一个dispatch，在异步回调里继续调用diaptch传递给reducer（比如then, setTimeout等异步）
export const increment_async = payload => {
  return dispatch => {
    setTimeout(() => {
      dispatch({ type: INCREMENT_ASYNC, payload })
    }, 2000);
  }
};

// 2.实现异步方式二：使用redux-sage 抽离异步代码包装 increment_async
export const increment_sage_async = payload => ({type: INCREMENT_ASYNC, payload});