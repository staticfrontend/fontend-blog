/**
 * Vuex
    流程：
      Components触发dispatch到actions并不直接提交mutations，因为actions里面可能进行异步请求
      异步/同步请求后，commit到mutations，mutaions必须是同步的，所有状态的更改都需要经过mutations，可以追踪到所有状态的变化
      mutations改变store里面的状态
    还有getters和module：
      getters：类似vue中的计算属性，有缓存
      module：将store分割为模块
 */
import Vue from 'vue'
import Vuex from 'vuex'
// 导入模块
import products from './modules/products'
import cart from './modules/cart'

// 1. Vue使用：Vue.use使用Vuex
Vue.use(Vuex)

// 2. Vue使用：Vuex.Store
export default new Vuex.Store({
  // vuex中的严格模式，开启后，如果在组件中直接修改state的状态会抛出错误；生产模式不要开启，会降低性能
  strict: process.env.NODE_ENV !== 'production',
  // state是响应式的
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  // getters类似于计算属性
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  // 状态的修改必须提交mutations，mutations必须保证是同步执行的；
  // mutations同步执行时，可以不用actions，直接通过commit提交mutations里定义的方法(或mapMutations)
  mutations: {
    // mutations里的方法传入state和payload，payload为调用方法传入的参数
    increate (state, payload) {
      state.count += payload
    }
  },
  // 执行异步操作，就需要actions
  actions: {
    // actions里的方法传入context和payload，内部修改状态必须通过mutations
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000)
    }
  },
  // 注册模块
  modules: {
    products, // 产品模块
    cart, // 购物车模块
  }
})
