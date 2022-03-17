/**
 * 利用 createContext 和 useContext 来合并 Store 实现全局状态共享
 */
import CounterStore from "./Counter/CounterStore"
import TodoListStore from "./Todos/TodoListStore"
import { createContext, useContext } from "react"

class RootStore {
  constructor() {
    this.counterStore = new CounterStore()
    this.todoListStore = new TodoListStore()
  }
}

const RootStoreContext = createContext()

const RootStoreProvider = ({ store, children }) => {
  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  )
}

const useRootStore = () => {
  return useContext(RootStoreContext)
}

export { RootStore, RootStoreProvider, useRootStore }
