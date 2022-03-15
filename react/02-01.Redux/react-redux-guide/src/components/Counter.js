import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as couterActions from '../store/actions/counter.actions';

function Counter({ count, increment, decrement, increment_async, increment_sage_async }) {
  return <div>
    <button onClick={() => increment(20)}>+</button>
    <span>{count}</span>
    <button onClick={() => decrement(5)}>-</button>
  </div>
}


const mapStateToProps = state => ({
  // 映射到组件的props中
  count: state.counter.count
});


// mapDispatchToProps 使用方式1
// const mapDispatchToProps = dispatch => ({
//   // 映射到组件的props中
//   increment(payload) { dispatch(couterActions.increment(payload)) }
// })


// mapDispatchToProps 使用方式2 bindActionCreators
// const mapDispatchToProps = dispatch => ({
//   ...bindActionCreators({
//     increment(payload) {
//       return couterActions.increment(payload)
//     },
//     decrement(payload) {
//       return couterActions.decrement(payload)
//     }
//   }, dispatch)
// })

// 抽离到actions文件里
const mapDispatchToProps = dispatch => bindActionCreators(couterActions, dispatch)

// 1. connect 方法会帮助我们订阅store 当store中的状态发生更改的时候 会帮助我们重新渲染组件
// 2. connect 方法可以让我们获取store中的状态 将状态通过组件的props属性映射给组件
// 3. connect 方法可以让我们获取 dispatch 方法
export default connect(mapStateToProps, mapDispatchToProps)(Counter);