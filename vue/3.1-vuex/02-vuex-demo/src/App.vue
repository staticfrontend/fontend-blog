<template>
  <div id="app">
    <h1>Vuex - Demo</h1>

    <h2>state的使用</h2>
    <!-- count：{{ $store.state.count }} <br>
    msg: {{ $store.state.msg }} -->
    <!-- count：{{ count }} <br>
    msg: {{ msg }} -->

    count：{{ num }} <br>
    msg: {{ message }}

    <h2>Getter</h2>
    <!-- reverseMsg: {{ $store.getters.reverseMsg }} -->
    reverseMsg: {{ reverseMsg }}

    <h2>Mutation</h2>
    <!-- <button @click="$store.commit('increate', 2)">Mutation</button> -->
    <button @click="increate(3)">Mutation</button>

    <h2>Action</h2>
    <!-- <button @click="$store.dispatch('increateAsync', 5)">Action</button> -->
    <button @click="increateAsync(6)">Action</button>

    <h2>Module</h2>
    <!-- products: {{ $store.state.products.products }} <br>
    <button @click="$store.commit('setProducts', [])">Mutation</button> -->
    products: {{ products }} <br>
    <button @click="setProducts([])">Mutation</button>

    <h2>strict严格模式直接修改state会报错</h2>
    <button @click="$store.state.msg = 'Lagou'">strict</button>
  </div>
</template>
<script>
/**
 * 1. state的使用
      方式1：$store.state.msg
      方式2：computed: { ...mapState({ message: 'msg' }) }
   2. getters
      方式1：$store.getters.reverseMsg
      方式2：computed: { ...mapGetters(['reverseMsg']) }
   3. mutations
      方式1：@click="$store.commit('increate', 2)"
      方式2：
        methods： { ...mapMutations(['increate']) } 
        @click="increate(2)"
   4. actions
      方式1：@click="$store.dispatch('increateAsync', 5)"
      方式2：
        methods: { ...mapActions(['increateAsync']), } 
        @click="increateAsync(6)"
   5. module
      访问模块中的状态：$store.state.products.products
      提交模块中的mutations: $store.commit('setProducts', [])"
 */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    // count: state => state.count
    // ...mapState(['count', 'msg'])
    ...mapState({ num: 'count', message: 'msg' }), // 给state数据设置别名
    ...mapGetters(['reverseMsg']), // 翻转msg
    ...mapState('products', ['products']) // 模块，第一个参数为模块名
  },
  methods: {
    ...mapMutations(['increate']),
    ...mapActions(['increateAsync']), // 异步必须通过actions
    ...mapMutations('products', ['setProducts']) // 模块
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
