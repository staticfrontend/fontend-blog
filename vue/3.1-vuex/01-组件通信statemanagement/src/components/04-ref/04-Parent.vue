<template>
  <div>
    <h1>ref Parent</h1>

    <div>在普通标签上使用ref，获取的是dom</div>
    <div>在组件标签上使用ref，获取的是组件实例</div>

    <child ref="c"></child>
  </div>
</template>

<script>
import child from './04-Child'
export default {
  components: {
    child
  },
  mounted () {
    this.$refs.c.focus()
    this.$refs.c.value = 'hello input'
  }
}
</script>

<style>

</style>