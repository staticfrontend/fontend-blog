let _Vue = null
class Store {
  constructor (options) {
    const {
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options
    // 将Store实例的state(也就是传入的state)用Vue.observable定义成响应式数据
    this.state = _Vue.observable(state)
    // 把this.getters，使用Object.defineProperty代理Store实例的getters，getters[key](state)作为get里的返回值
    // 访问$store.getters.reverseMsg 也就是访问Store实例getters.reverseMsg(state)
    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get () {
          return getters[key](state)
        }
      })
    })

    // 将Store实例的mutations和actions存起来
    this._mutations = mutations
    this._actions = actions
  }

  // 调用commit的时候，调用this._mutations里对应的type方法，并传入state和payload
  commit (type, payload) {
    this._mutations[type](this.state, payload)
  }

  // 调用dispatch的时候，调用this._actions里对应的type方法，并传入this和payload
  dispatch (type, payload) {
    this._actions[type](this, payload)
  }
}

function install (Vue) {
  _Vue = Vue
  // 使用mixin，在vue的beforeCreate生命周期里获取new Vue传入的Store类的实例
  _Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {
  Store,
  install
}
