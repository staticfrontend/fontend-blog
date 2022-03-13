/**
 * 构建fiber对象
   fiber对象的结构为：
    {
      type         节点类型 (元素, 文本, 组件)(具体的类型)
      props        节点属性 (还包含children)
      stateNode    当前节点真实 DOM 对象 | 组件实例对象
      tag          节点标记，通过这个标记可以区分出fiber是类组件，函数组件，还是普通的dom节点 (对具体类型的分类 hostRoot() || hostComponent || classComponent || functionComponent)
      effects      数组, 存储需要更改的 fiber 对象
      effectTag    当前 Fiber 要被执行的操作：placement, update, delete(新增, 修改, 删除)
      parent       当前 Fiber 的父级 Fiber
      child        当前 Fiber 的子级 Fiber
      sibling      当前 Fiber 的下一个兄弟 Fiber
      alternate    Fiber 备份 fiber 新旧比对时使用
    }
 */
import { updateNodeElement } from "../DOM"
import {
  createTaskQueue,
  arrified,
  createStateNode,
  getTag,
  getRoot
} from "../Misc"

// 任务队列
const taskQueue = createTaskQueue()

// 要执行的子任务
let subTask = null

let pendingCommit = null

/**
 * render 
 * @param {*} element 子级
 * @param {*} dom 为父级
 */
export const render = (element, dom) => {
  /**
   * 1. 向任务队列中添加任务：任务就是通过 vdom 对象 构建 fiber 对象
   * 2. 指定在浏览器空闲时执行任务
   */

  // 为每一个VirtualDom创建fiber对象，这个对象中包含了父级和子级，往任务队列添加任务
  taskQueue.push({
    dom, // 父级
    props: { children: element } // 子级
  })

  // 指定在浏览器空闲的时间去执行添加的任务
  requestIdleCallback(performTask)
}

/**
 * Fiber第二阶段-真实dom的渲染
 * @param {*} fiber 
 */
const commitAllWork = fiber => {
  
  /**
   * 循环根节点fiber对象的 effets 数组构建 DOM 节点树
     • 根节点的fiber对象的effects数组中存储了所有子节点fiber对象
   */
  console.log('commitAllWork', fiber);
  
  fiber.effects.forEach(item => {
    // if (item.tag === "class_component") {
    //   item.stateNode.__fiber = item
    // }

    if (item.effectTag === "delete") { 
      // fiber的effectTag为'delete'，执行删除操作
      item.parent.stateNode.removeChild(item.stateNode)
    } else if (item.effectTag === "update") { 
      // fiber的effectTag为'update'，执行更新操作
      if (item.type === item.alternate.type) {
        // 节点类型相同，更新内容和属性
        updateNodeElement(item.stateNode, item, item.alternate)
      } else {
        // 节点类型不同，新节点替换旧节点
        item.parent.stateNode.replaceChild(
          item.stateNode, // 新节点
          item.alternate.stateNode // 旧节点
        )
      }
    } else if (item.effectTag === "placement") {
      // 向页面中新增节点
      let fiber = item // 当前要追加的子节点
      let parentFiber = item.parent // 当前要追加的子节点的父级

      // ------------ 类组件或函数组件 （只看普通节点可忽略这里）--------------------
      // 找到父级为普通节点，往普通节点追加类/函数组件返回的内容；因为组件是不能直接追加真实DOM节点的
      while (parentFiber.tag === "class_component" ||parentFiber.tag === "function_component") {
        // tag为"class_component"或"function_component"，直到找到父级为普通节点才跳出循环
        parentFiber = parentFiber.parent
      }
      // ------------ 类组件或函数组件结束 （只看普通节点可忽略这里）--------------------

      if (fiber.tag === "host_component") {
        // 如果子节点是普通节点，将子节点追加到父级中
        parentFiber.stateNode.appendChild(fiber.stateNode)
      }
    }
  })
  
  // 渲染后，备份旧的 fiber 节点对象到根节点fiber对象stateNode上，用于stateNode 转成真实dom后，可以取到旧的 fiber 节点对象和新的 fiber 节点对象比对
  fiber.stateNode.__rootFiberContainer = fiber
}

/**
 * 任务出栈，构建根节点(最外层节点)的fiber对象
 */
const getFirstTask = () => {
  /**
   * 从任务队列中获取任务
   */
  const task = taskQueue.pop()
  console.log('task', task);
  
  /**
   * 类节点注释掉
    if (task.from === "class_component") {
      const root = getRoot(task.instance)
      task.instance.__fiber.partialState = task.partialState
      return {
        props: root.props,
        stateNode: root.stateNode,
        tag: "host_root",
        effects: [],
        child: null,
        alternate: root
      }
    }
  */
  
  /**
   * 构建根节点的fiber对象，并返回
   */
  return {
    props: task.props,
    stateNode: task.dom, // 存储根节点对应的dom对象
    tag: "host_root", // 节点标记 类型为'host_root'
    effects: [],
    child: null,
    alternate: task.dom.__rootFiberContainer, // 在新的render发生时，构建新的根节点fiber对象，获取旧DOM的根节点fiber对象 __rootFiberContainer 保存在新节点fiber对象的alternate属性上（旧DOM是stateNode渲染，stateNode保存了__rootFiberContainer，所以旧DOM上有__rootFiberContainer）
  }
}

/**
 * 构建子级节点fiber对象 （构建父节点和子节点的关系，传入fiber 父节点和children 子节点）
 * @param {*} fiber 父节点
 * @param {*} children 子节点
 */
const reconcileChildren = (fiber, children) => {
  // console.log('reconcileChildren', fiber);
  
  /**
   * children 可能对象 也可能是数组
   * 将children 转换成数组
   */
  const arrifiedChildren = arrified(children)

  // -------------- 循环拿到数组中的VirtualDOM，把子级VirtrualDOM转为fiber --------------
 
  let index = 0 // 循环 arrifiedChildren 使用的索引
  
  let numberOfElements = arrifiedChildren.length // arrifiedChildren 数组中元素的个数
  
  let element = null // 循环过程中的循环项 就是子节点的 virtualDOM 对象
  
  let newFiber = null // 子级 fiber 对象
  
  let prevFiber = null // 上一个兄弟 fiber 对象
  
  let alternate = null // 旧fiber对象的子节点

  // 获取子节点对应的备份节点：
  // fiber.alternate 为旧fiber对象，这里获取第一个备份子节点fiber
  if (fiber.alternate && fiber.alternate.child) {
    alternate = fiber.alternate.child
  }

  // 循环子级VirtrualDOM
  while (index < numberOfElements || alternate) {
    // 子级 virtualDOM 对象
    element = arrifiedChildren[index]
    // console.log(element);
    
    if (!element && alternate) {
      // 没有当前子节点有当前备份节点alternate 则做删除操作

      alternate.effectTag = "delete" // effectTag标记为'delete'
      fiber.effects.push(alternate)
    } else if (element && alternate) {
      // 有当前子节点和当前备份节点alternate 则做更新操作
      newFiber = { // 更新操作的fiber对象
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: "update", // effectTag标记为'update'
        parent: fiber,
        alternate,
      }
      
      if (element.type === alternate.type) {
        // 新节点和老节点元素类型相同，不需要重新创建节点，用旧fiber的stateNode
        newFiber.stateNode = alternate.stateNode
      } else {
        // 元素类型不同，不需要进行比对，创建新的真实dom节点/组件实例，用于后面替换老的节点
        newFiber.stateNode = createStateNode(newFiber)
      }
    } else if (element && !alternate) {
      // 初始渲染 和 新增操作
      // 有当前子节点但没有备份节点alternate 则作新增操作

      // 构建子级节点 fiber 对象
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element), // 节点类型
        effects: [],
        effectTag: "placement", // 节点操作：新增
        stateNode: null,
        parent: fiber, // 初始渲染当前节点的父级为根节点fiber
      }
      // 为fiber节点添加真实DOM对象或组件实例对象
      newFiber.stateNode = createStateNode(newFiber)
    }

    /**
     * 第一个子节点作为父级的子节点（判断条件index === 0），第二个子节点作为第一个子节点的下一个兄弟节点 
     */
    // prevFiber = newFiber
    if (index === 0) {
      // 第一个子节点作为父级的子节点，指定根节点fiber的子级为 newFiber
      fiber.child = newFiber
    } else if (element) {
      // 第二个子节点作为第一个子节点的下一个兄弟节点
      prevFiber.sibling = newFiber
    }

    // ------------- 用作更新和删除 -------------------
    if (alternate && alternate.sibling) {
      // index === 0 时 alternate 为旧fiber的第一个子节点（备份子节点），将 alternate 赋值为下一个兄弟节点用于while循环
      alternate = alternate.sibling
    } else {
      alternate = null
    }

    // 更新
    prevFiber = newFiber
    index++
  }
}

/**
 * executeTask
    • 通过 reconcileChildren 方法构建第一层子级fiber对象
    • 递归 executeTask 构建左侧节点树：判断 fiber.child 存在，也就是第一层子级存在，则将这个子级当做父级，递归构建这个父级下的子级；然后依次递归第n层，直到左侧子节点数fiber对象构建完成
    • 当前fiber如果存在同级，返回同级，构建同级的子级；当前fiber如果没有同级，返回到父级，看父级是否有同级
 * @param {*} fiber 
 * @returns 
 */
const executeTask = fiber => {
  /**
   * reconcileChildren 方法构建子级fiber对象
   */
  // ----------- 类组件和函数组件的fiber构建（只看普通节点可忽略这里） ---------------
  if (fiber.tag === "class_component") {
    if (fiber.stateNode.__fiber && fiber.stateNode.__fiber.partialState) {
      fiber.stateNode.state = {
        ...fiber.stateNode.state,
        ...fiber.stateNode.__fiber.partialState
      }
    }
    reconcileChildren(fiber, fiber.stateNode.render())
  } else if (fiber.tag === "function_component") {
    reconcileChildren(fiber, fiber.stateNode(fiber.props))
  } 
  // ----------- 类组件和函数组件的fiber构建结束（只看普通节点可忽略这里） ----------------
  else {
    // 普通节点的构建
    reconcileChildren(fiber, fiber.props.children)
  }

  // console.log(fiber);
  
  /**
   * 先遍历左侧节点树：当前fiber的子级存在返回子级
   * 递归 executeTask 构建左侧节点树：构建第一层子级fiber对象的子级，然后依次递归构建第n层子级fiber对象的子级，直到构建完成左侧节点树
   * 实现：如果fiber.child返回子级，并且将这个子级当做父级，递归构建这个父级下的子级
   */
  if (fiber.child) {
    return fiber.child
  }

  /**
   * 当前fiber如果存在同级，返回同级，构建同级的子级
   * 当前fiber如果没有同级，返回到父级，看父级是否有同级
   */
  let currentExecutelyFiber = fiber

  while (currentExecutelyFiber.parent) {
    /**
     * 将所有的fiber对象存储在最外层节点的effects中：
       • 循环时找到每个节点的父级，给每个节点父级effects赋值；父级的effects数组和子级的effects数组进行合并，子级的effects数组和当前的fiber对象合并
     */
    currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    )

    // 当前fiber如果存在同级，返回同级，构建同级的子级
    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }
    // 当前fiber如果没有同级，则退到父级，看父级是否有同级
    currentExecutelyFiber = currentExecutelyFiber.parent
  }

  // console.log(currentExecutelyFiber);
  
  // 最后dom树构建完成后，currentExecutelyFiber为根节点的fiber对象，用pendingCommit保存起来
  pendingCommit = currentExecutelyFiber
}

/**
 * workLoop
 * 执行大的任务拆分成的小任务 => 执行子任务（这里的子任务也就是一层层的VirtualDOM转成fiber的任务）
 * @param {*} deadline 
 */
const workLoop = deadline => {
  /**
   * 如果子任务不存在 就去获取子任务
   */
  if (!subTask) {
    subTask = getFirstTask()
  }
  /**
   * 如果任务存在并且浏览器有空余时间就调用 executeTask 方法执行任务 
   * executeTask 接受任务 返回新的子任务
   */
  while (subTask && deadline.timeRemaining() > 1) {
    // 接受返回新的任务赋给子任务subTask
    // 把根节点的fiber对象传递给 executeTask，后面subTask就是一个个子任务了
    subTask = executeTask(subTask)
  }

  /**
   * Fiber第二阶段-实现初始渲染
   */
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

/**
 * performTask 
 * 作用：在浏览器空闲时间执行任务，在空闲的时间一直执行没有执行完的子任务
 * @param {*} deadline 获取浏览器空闲时间
 */
const performTask = deadline => {
  /**
   * 执行子任务
   */
  workLoop(deadline)
  /**
   * 判断任务是否存在，判断任务队列中是否还有任务没有执行
   * 在空闲的时间一直执行子任务
   */
  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask)
  }
}


export const scheduleUpdate = (instance, partialState) => {
  taskQueue.push({
    from: "class_component",
    instance,
    partialState
  })
  requestIdleCallback(performTask)
}
