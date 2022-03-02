import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 3. Vue使用：实例化Vue传入Vuex.Store的实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

console.log(store)
