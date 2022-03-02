/**
 * 简单实现一个多组件共享状态方案
    原因：多个组件的状态不易维护和更新
    将不同组件之间共享状态抽取出来存储在一个全局对象中，并且使用的时候保证是响应式的，任何组件都可以获取和修改全局对象中的状态
 */
export default {
  debug: true,
  state: {
    user: {
      name: 'xiaomao',
      age: 18,
      sex: '男'
    }
  },
  setUserNameAction (name) {
    if (this.debug) {
      console.log('setUserNameAction triggered：', name)
    }
    this.state.user.name = name
  }
}