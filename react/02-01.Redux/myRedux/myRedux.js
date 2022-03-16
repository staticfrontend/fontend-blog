/**
 * Redux 实现原理
    1.reducer, action, store原理：
      createStore(reducer, initState) 传入reducer和初始state
      • getState() 利用闭包返回currentState，这样currentState一直就在内存中不会被销毁
      • dispatch(action) dispatch的时候接受传入的action，然后调用传入的 currentState = reducer(currentState, action)；
        reducer 的返回值是修改后的state，这样就实现了state的更新
      • subscribe(cb) 订阅传入的回调函数cb，在 dispatch 时发布调用所有的订阅者cb
    2.enhancer 第三个参数可以让 createStore 的调用者对 createStore的返回值进行增强
    3.applyMiddleware原理：
      applyMiddleware(...middlewares) {
        return function(createStore) {
          return function(reducer) {
            // 实例化createStore 传入 reducer
          }
        }
      }
      • applyMiddleware 接收多个 middleware，里面用函数柯里化形式接收 createStore, reducer；后面要用到store实例，所以实例化 createStore 传入 reducer
      • 传入的 middleware 函数是 store => next => action { next(action) } 的形式
      • 遍历 middlewares 传递第一层的参数 var chain = middlewares.map(middleware => middleware(store))
      • 还是使用函数柯里化实现中间件的链式调用：首先传入dispatch作为柯里化的第一个参数：chainCall(chain)(store.dispatch)
        function chianCall(chain) {
          return dispatch => { // 倒序遍历chain }
        }
        接收 dispatch, 倒序遍历chain, 先调用最后一个中间件, 此时 next 传入 dispatch, 这是第一次遍历
        第二次遍历把dispatch改写为下一个中间件的aciton函数，此时 next 传入 下一个中间件的 action
        第n次以此类推
 */
function createStore (reducer, preloadedState, enhancer) {
  // reducer 类型判断 
  if (typeof reducer !== 'function') throw new Error('redcuer必须是函数');

  if (typeof enhancer !== 'undefined') {
    // 传递了 enhancer 参数并且是函数
    if (typeof enhancer !== 'function') {
      throw new Error('enhancer必须是函数')
    }

    // 调用 enhancer 传递createStore，继续调用传入 reducer 和 preloadedState；把接下来做的事给 enhancer
    return enhancer(createStore)(reducer, preloadedState);
  }

  // 状态
  var currentState = preloadedState;
  // 订阅者
  var currentListeners = [];
  // 获取状态
  function getState () {
    return currentState;
  }
  // 用于触发action的方法
  function dispatch (action) {
    // 判断action是否是一个对象
    if (!isPlainObject(action)) throw new Error('action必须是一个对象');
    // 判断action中的type属性是否存在
    if (typeof action.type === 'undefined') throw new Error('action对象中必须有type属性');
    // 调用reducer函数 处理状态
    currentState = reducer(currentState, action);
    // 调用订阅者 通知订阅者状态发生了改变
    for (var i = 0; i < currentListeners.length; i++) {
      var listener = currentListeners[i];
      listener();
    }
  }
  // 订阅状态的改变
  function subscribe (listener) {
    currentListeners.push(listener);
  }

  // 默认调用一次dispatch方法 存储初始状态(通过reducer函数传递的默认状态)
  dispatch({type: 'initAction'})

  return {
    getState,
    dispatch,
    subscribe
  }
}

// 判断参数是否是对象类型
// 判断对象的当前原型对象是否和顶层原型对象相同
function isPlainObject (obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) != null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(obj) === proto;
}

function applyMiddleware (...middlewares) {
  // 中间件可能有多个，用剩余参数形式，接受的是数组 middlewares
  return function (createStore) {
    // 定义一个函数接收createStore；再定义一个函数接受reducer, preloadedState
    return function (reducer, preloadedState) {
      // 创建 store 拿到 store 给中间件传递参数
      var store = createStore(reducer, preloadedState);

      // 阉割版的 store
      var middlewareAPI = {
        getState: store.getState,
        dispatch: store.dispatch
      }

      // 调用中间件的第一层函数(也就是传入store的那一层)，传递阉割版的store对象
      var chain = middlewares.map(middleware => middleware(middlewareAPI));

      // 把 dispatch 传递给 next
      var dispatch = chainCall(...chain)(store.dispatch);
      console.log(dispatch);

      return {
        ...store,
        dispatch
      }
    }
  }
}

// chain 为 多个中间件函数([function (next) => (action) { }, ..... ])
function chainCall () {
  var funcs = [...arguments]; // arguments 伪数组，转为数组
  return function (dispatch) {
    // 接收 dispatch, 倒序遍历chain, 先调用最后一个中间件, 此时 next 传入 dispatch (最后一个中间件next参数为dispatch)
    for (var i = funcs.length - 1; i >= 0; i--) {
      // 第一次循环为最后一个中间件next函数调用，next传入dispatch；第二次循环把dispatch改写为其下一个中间件的aciton函数，则第二个中间件next传入的是下一个中间件的action
      dispatch = funcs[i](dispatch);
    }
    // 返回第二个中间件函数的action
    return dispatch;
  }
}

function bindActionCreators (actionCreators, dispatch) {
  var boundActionCreators = {};
  for (var key in actionCreators) {
    (function (key) {
      boundActionCreators[key] = function () {
        dispatch(actionCreators[key]())
      }
    })(key)
  }
  return boundActionCreators;
}

function combineReducers (reducers) {
  // 1. 检查reducer类型 它必须是函数
  var reducerKeys = Object.keys(reducers);
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] !== 'function') throw new Error('reducer必须是函数');
  }
  // 2. 调用一个一个的小的reducer 将每一个小的reducer中返回的状态存储在一个新的大的对象中
  return function (state, action) {
    var nextState = {};
    for (var i = 0; i < reducerKeys.length; i++) {
      var key = reducerKeys[i];
      var reducer = reducers[key];
      var previousStateForKey = state[key];
      nextState[key] = reducer(previousStateForKey, action)
    }
    return nextState;
  }
}