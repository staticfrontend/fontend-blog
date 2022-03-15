/**
 * redux-sage的使用
    takeEvery 接收 action.type
    put 触发 action，传递到reducer；类似于dispatch
 */
import { takeEvery, put, delay } from 'redux-saga/effects';
import { increment } from '../actions/counter.actions';
import { INCREMENT_ASYNC } from '../const/counter.const';

// takeEvery 接收 action
// put 触发 action
function* increment_async_fn (action) {
  yield delay(2000);
  yield put(increment(action.payload))
}

export default function* counterSaga () {
  // 接收action的类型action.type，执行 increment_async_fn
  yield takeEvery(INCREMENT_ASYNC, increment_async_fn)
}