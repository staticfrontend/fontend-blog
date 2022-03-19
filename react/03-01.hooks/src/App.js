import React from 'react';
import ReactDOM from 'react-dom';
import UseHooksDemo from './UseHooksDemo';
import UseFormInput from './UseFormInput';

let state = []; // 多个状态
let setters = []; // 多个状态对应的方法
let stateIndex = 0;

/**
 * 创建设置状态值的方法：更新state 对应索引的值，更新视图
 * @param {*} index 
 */
function createSetter (index) {
  // 利用闭包，把状态对应的下标 index 保存下来
  // 返回设置状态的方法
  return function (newState) { 
    state[index] = newState; // 更新state对应索引的值
    render (); // 更新视图
  }
}

/**
 * useState 实现原理
 * @param {*} initialState 
 */
function useState (initialState) {
  // 处理initialState只在初次渲染赋值给state，再次render调用useState取更新值state[stateIndex]
  state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState;
  setters.push(createSetter(stateIndex));

  let value = state[stateIndex]; // 当前state
  let setter = setters[stateIndex]; // 设置状态对应的方法

  stateIndex++; // useState可以被多次调用存储多个状态；useState 调用一次，stateIndex 加一次

  // 返回一个数组，数组的第一个值是状态，第二个值是设置状态的方法
  return [value, setter];
}

/**
 * 更新视图
 */
function render () {
  stateIndex = 0;
  effectIndex = 0;
  ReactDOM.render(<App />, document.getElementById('root'));
}

// 上一次的依赖值
let prevDepsAry = [];
let effectIndex = 0;

function useEffect(callback, depsAry) {
  // 判断callback是不是函数
  if (Object.prototype.toString.call(callback) !== '[object Function]') throw new Error('useEffect函数的第一个参数必须是函数');
  // 判断depsAry有没有被传递
  if (typeof depsAry === 'undefined') {
    // 没有传递
    callback();
  } else {
    // 判断depsAry是不是数组
    if (Object.prototype.toString.call(depsAry) !== '[object Array]') throw new Error('useEffect函数的第二个参数必须是数组');
    // 获取上一次的状态值
    let prevDeps = prevDepsAry[effectIndex];
    // 将当前的依赖值和上一次的依赖值做对比 如果有变化 调用callback
    let hasChanged = prevDeps ? depsAry.every((dep, index) => dep === prevDeps[index]) === false : true;
    // 判断值是否有变化
    if (hasChanged) {
      callback();
    }
    // 同步依赖值
    prevDepsAry[effectIndex] = depsAry;
    effectIndex++;
  }
}

function useReducer (reducer, initialState) {
  const [state, setState] = useState(initialState);
  function dispatch (action) {
    // 调用reducer 返回新的state
    const newState = reducer(state, action);
    setState(newState);
  }
  return [state, dispatch];
}

function App() {
  function reducer (state, action) {
    switch (action.type) {
      case 'increment':
        return state + 1;
      case 'decrement':
        return state - 1;
      default:
        return state;
    }
  }
  const [countState, setCountState] = useState(0);

  const [count, dispatch] = useReducer(reducer, 0);
  return <div>
    <h3>useState实现原理</h3>
    {countState}
    <button onClick={() => setCountState(countState + 1)}>+1</button>

    <h3>useReducer实现原理</h3>
    {count}
    <button onClick={() => dispatch({type: 'increment'})}>+1</button>
    <button onClick={() => dispatch({type: 'decrement'})}>-1</button>

    <h3>自定义hooks</h3>
    <UseHooksDemo />
    <UseFormInput />
  </div>;
}

export default App;
