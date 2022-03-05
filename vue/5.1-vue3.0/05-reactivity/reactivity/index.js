/**
  * Vue3响应式系统原理
  * Vue3响应式和Vue2的区别
      • vue3中Proxy 对象实现属性监听；在初始化的时候不需要遍历所有的属性，不需要通过definePropery把属性转换为getter和setter
      • vue3中多层属性嵌套，在访问属性过程中处理下一级属性，而vue2时初始化就遍历处理所有的属性为响应式；所以vue3中响应式系统比vue2中好
      • 默认监听动态添加的属性
      • 默认监听属性的删除操作
      • 默认监听数组索引和 length 属性
      • 可以作为单独的模块使用
  * 核心方法
      • reactive/ref/toRefs/computed
      • effect: watch函数的内部使用了effect这个底层函数
      • track: 收集依赖
      • trigger: 触发更新
  * 总结
    reactive：new Proxy(data, handler)
    effect：effect调用接收的callback()，callback依赖了响应式属性，会触发getter里面收集依赖将callback按照 Map{ key => Set{ callback } }
            的形式收集，在属性key发生更新时，调用Map{ key => Set{ callback } } 里面的callback() 触发更新
 */

// 判断是否为对象(不为null)
const isObject = val => val !== null && typeof val === 'object'

// 判断是否为对象，为对象则转换为响应式对象
const convertObjToReactive = target => isObject(target) ? reactive(target) : target

// 判断target是否有属性key
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (target, key) => hasOwnProperty.call(target, key)


/**
 * reactive创建响应式数据原理
 * @param {*} object 
 */
export function reactive (data) {
  // 判断参数是否为对象
  if (!isObject(data)) return data

  // handler拦截器对象
  const handler = {
    get (data, key, receiver) {
      // 收集依赖
      track(data, key)
      // console.log('get', key);

      // 返回data中key的值 data[key] => Reflect.get(data, key, receiver)
      const result = Reflect.get(data, key, receiver)
      // 如果当前key属性对应值也是对象，也就是对象中有嵌套属性，会在getter中递归收集下级属性的依赖
      return isObject(result) ? reactive(result) : result // return convertObjToReactive(result)
    },
    set (data, key, value, receiver) {
      // 获取旧值
      const oldValue = Reflect.get(data, key, receiver)
      // set 需要返回布尔值
      let result = true
      // 旧值和新值不同，更新值并触发更新
      if (oldValue !== value) {
        result = Reflect.set(data, key, value, receiver)

        // console.log('set', key, value);
        // 触发更新
        trigger(data, key)
      }
      return result
    },
    deleteProperty (data, key) {
      // 判断是否有自己的key属性
      const hadKey = hasOwn(data, key)
      const result = Reflect.deleteProperty(data, key)
      if (hadKey && result) { // 有key属性并且删除成功
        console.log('delete', key);
        // 触发更新
        trigger(data, key)
      }
      return result
    }
  }

  // 最后返回代理对象
  return new Proxy(data, handler)
}

/**
 * effect原理，watchEffect内部调用effect来实现
 */
let activeEffect = null // 用于收集effect
export function effect (callback) {
  activeEffect = callback
  callback() // 调用callback访问响应式对象属性，触发getter收集依赖
  activeEffect = null
}

/**
 * 依赖收集
 * @param {*} target: data
 * @param {*} key
 * targetMap的结构为：WeakMap{ target => Map{ key => Set{ effect } } }
 */

let targetMap = new WeakMap()
export function track (target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 初始化将类型为WeakMap的targetMap 设置key为data，设置value为Map类型
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    // 初始化将类型为Map的depsMap 设置key为data的属性，value为Set类型
    depsMap.set(key, (dep = new Set()))
  }
  // 将effect添加进dep的去重依赖里
  dep.add(activeEffect)
  console.log(targetMap);
}

/**
 * 依赖更新
 * @param {*} target: data
 * @param {*} key 
 * 更新WeakMap{ target => Map{ key => Set{ effect } } } 中的 effect
 */
export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  // 看depMap是否有属性key的依赖
  const dep = depsMap.get(key)
  if (dep) {
    // 有属性key的依赖，触发依赖函数effect
    dep.forEach(effect => {
      effect()
    })
  }
}

/**
 * 创建响应式对象
 * raw 如果是对象，内部调用reactive创建响应式对象；如果是基本数据类型，创建一个只有value属性的响应式对象
 * @param {*} raw
 * returns { value: raw, __v_isRef: true }
 */
export function ref (raw) {
  
  // 判断 raw 是否是ref 创建的对象（有__v_isRef属性就是ref 创建的对象），如果是的话直接返回
  if (isObject(raw) && raw.__v_isRef) {
    return
  }
  // 如果是对象，convertObjToReactive创建响应式对象
  let value = convertObjToReactive(raw)

  // 创建一个只有value属性的响应式对象
  const obj = {
    __v_isRef: true, // 标识是否是ref 创建的对象
    get value () {
      console.log('get', value);

      track(obj, 'value')
      return value
    },
    set value (newValue) {
      if (newValue !== value) {
        // 修改obj 的 value值
        value = convertObjToReactive(newValue)
        console.log('set', value);

        trigger(obj, 'value')
      }
    },
  }
  return obj
}

/**
 * 把reactive函数返回的proxy对象的所有属性转换为对象
 * 对toRefs 返回的对象解构，解构的每个属性都是响应式对象 (其实也就是代理到proxy对象上了)
 * @param {*} proxy 
 */
export function toRefs (proxy) {
  // proxy如果是数组，创建一个新数组
  const ret = proxy instanceof Array ? new Array(proxy.length) : {}

  for (const key in proxy) {
    // 把每个属性转换为ref返回的对象
    ret[key] = toProxyRef(proxy, key)
  }

  return ret
}

function toProxyRef (proxy, key) {
  const r = {
    __v_isRef: true,
    get value () {
      return proxy[key]
    },
    set value (newValue) {
      proxy[key] = newValue
    }
  }
  return r
}

/**
 * 计算属性，监听内部函数的响应式变化
 * @param {*} getter 
 */
export function computed (getter) {
  const result = ref()

  effect(() => (result.value = getter()))

  return result
}