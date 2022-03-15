import { createStore, applyMiddleware } from "redux";
import RootReducer from "./reducers/root.reducer";
// import thunk from 'redux-thunk';
// import logger from "./middleware/logger"; // 自己开发的logger中间件
// import thunk from './middleware/thunk'; // 自己开发的redux-thunk中间件

import createSagaMidddleware from 'redux-saga';
import rootSaga from './sagas/root.saga';

// redux-sage的使用1：要先创建 sagaMiddleware，再applyMiddleware；redux-thunk直接使用 applyMiddleware
const sagaMiddleware = createSagaMidddleware();

// react-redux使用：引入createStore创建store容器，传入reducer和中间件
export const store = createStore(RootReducer, applyMiddleware(sagaMiddleware));

// redux-sage的使用2：启动 counterSaga
sagaMiddleware.run(rootSaga)
