### `1. 开发环境配置

#### 1.1 文件夹结构

| 文件 / 文件夹            | 描述                    |
| ------------------------ | ----------------------- |
| src                      | 存储源文件              |
| dist                     | 存储客户端代码打包文件  |
| build                    | 存储服务端代码打包文件  |
| server.js                | 存储服务器端代码        |
| webpack.config.server.js | 服务端 webpack 配置文件 |
| webpack.config.client.js | 客户端 webpack 配置文件 |
| babel.config.json        | babel 配置文件          |
| package.json             | 项目工程文件            |

创建 package.json 文件：`npm init -y`

#### 1.2 安装项目依赖

开发依赖：`npm install webpack webpack-cli webpack-node-externals @babel/core @babel/preset-env @babel/preset-react babel-loader nodemon npm-run-all -D`

项目依赖：`npm install express`

| 依赖项                 | 描述                                               |
| ---------------------- | -------------------------------------------------- |
| webpack                | 模块打包工具                                       |
| webpack-cli            | 打包命令                                           |
| webpack-node-externals | 打包服务器端模块时剔除 node_modules 文件夹中的模块 |
| @babel/core            | JavaScript 代码转换工具                            |
| @babel/preset-env      | babel 预置，转换高级 JavaScript 语法               |
| @babel/preset-react    | babel 预置，转换 JSX 语法                          |
| babel-loader           | webpack 中的 babel 工具加载器                      |
| nodemon                | 监控服务端文件变化，重启应用                       |
| npm-run-all            | 命令行工具，可以同时执行多个命令                   |
| express                | 基于 node 平台的 web 开发框架                      |

#### 1.3 环境配置

##### 1.3.1 创建 web 服务器

```javascript
// server.js
import express from "express"
const app = express()
app.use(express.static("dist"))
const template = `
  <html>
    <head>
      <title>React Fiber</title>
    </head>
    <body>
      <div id="root"></div>
			<script src="bundle.js"></script>
    </body>
  </html>
`
app.get("*", (req, res) => {
  res.send(template)
})
app.listen(3000, () => console.log("server is running"))
```

##### 1.3.2 服务端 webpack 配置

```javascript
// webpack.config.server.js
const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
  target: "node",
  mode: "development",
  entry: "./server.js",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  externals: [nodeExternals()]
}
```

##### 1.3.3 babel 配置

```javascript
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

##### 1.3.4 客户端 webpack 配置

```javascript
const path = require("path")

module.exports = {
  target: "web",
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}
```

##### 1.3.5 启动命令

```json
"scripts": {
  "start": "npm-run-all --parallel dev:*",
  "dev:server-compile": "webpack --config webpack.config.server.js --watch",
  "dev:server": "nodemon ./build/server.js",
  "dev:client-compile": "webpack --config webpack.config.client.js --watch"
},
```

### 2. requestIdleCallback

#### 2.1 核心 API 功能介绍

利用浏览器的空余时间执行任务，如果有更高优先级的任务要执行时，当前执行的任务可以被终止，优先执行高级别任务。

```javascript
requestIdleCallback(function(deadline) {
  // deadline.timeRemaining() // 获取浏览器的空余时间
})
```

#### 2.2 浏览器空余时间

在浏览器中，页面是一帧一帧绘制出来的，大多数设备的屏幕刷新率为1s 60次；当每秒内绘制的帧数（FPS）超过60时，页面渲染是流畅的；而当FPS小于60时，会出现一定程度的卡顿现象。


1s 60帧，每一帧分到的时间是 1000/60 ≈ 16 ms，如果每一帧执行的时间小于16ms，就说明浏览器有空余时间

如果任务在剩余的时间内没有完成则会停止任务执行，继续优先执行主线程任务，也就是说 requestIdleCallback 总是利用浏览器的空余时间执行任务

#### 2.3 API 功能体验

页面中有两个按钮和一个DIV，点击第一个按钮执行一项昂贵的计算，使其长期占用主线程，当计算任务执行的时候去点击第二个按钮更改页面中 DIV 的背景颜色。

使用 requestIdleCallback 就可以完美解决这个卡顿问题。

```html
<div class="playground" id="play">playground</div>
<button id="work">start work</button>
<button id="interaction">handle some user interaction</button>
```

```css
<style>
  .playground {
    background: palevioletred;
    padding: 20px;
    margin-bottom: 10px;
  }
</style>
```

```javascript
var play = document.getElementById("play")
var workBtn = document.getElementById("work")
var interactionBtn = document.getElementById("interaction")
var iterationCount = 100000000
var value = 0

var expensiveCalculation = function (IdleDeadline) {
  while (iterationCount > 0 && IdleDeadline.timeRemaining() > 1) {
    value =
      Math.random() < 0.5 ? value + Math.random() : value + Math.random()
    iterationCount = iterationCount - 1
  }
  requestIdleCallback(expensiveCalculation)
}

workBtn.addEventListener("click", function () {
  requestIdleCallback(expensiveCalculation)
})

interactionBtn.addEventListener("click", function () {
  play.style.background = "palegreen"
})
```

### 3 Fiber

#### 3.1 问题

React 16 之前的版本比对更新 VirtualDOM 的过程是采用循环加递归比对实现的，这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，直到整棵 VirtualDOM 树比对更新完成之后主线程才能被释放，主线程才能执行其他任务。这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿, 非常的影响用户体验。 

Fiber其实是React中dom比对新的算法。

React16之前存在的核心问题： 

* VirtualDOM比对的过程中递归无法中断，长期占用主线程。 

* JavaScript 又是单线程，无法同时执行其他任务，导致任务延迟页面卡顿，用户体验差。

#### 3.2 React16 解决方案

* 1. 使用 requestIdleCallback api 利用浏览器空闲时间进行VirtualDOM 比对，VirtualDOM 比对不会长时间占用主线程；有高优先级的任务执行，就会暂停VirtualDOM 比对，先执行高优先级任务，等高优先级任务执行完，再回来比对VirtualDOM。
* 2. 由于递归需要一层层进入，一层层退出，过程不能中断；要想任务的中断和继续，则放弃递归只采用循环来比对，因为循环可以被中断；只需要把循环的条件保存下来，下一次任务就可以从中断的地方继续执行了。
* 3. 任务拆分，将大的任务拆分成一个个的小任务。

#### 3.3 实现思路

在 Fiber 方案中，为了实现任务的终止再继续，DOM比对算法被分成了两部分：

第一部分是VirtualDOM的比对，第二部分是真实dom的更新；VirtualDOM的比对是可以中断的，真实dom的更新是不可以中断的。

具体过程为：

1. 构建 Fiber    (可中断)
2. 提交 Commit   (不可中断)

总结一下：

如果是 DOM 初始渲染: 通过virtualDOM构建Fiber对象 -> Fiber -> Fiber对象存储在数组 -> 将Fiber对象要执行的操作应用到真实DOM中

如果是 DOM 更新操作: 重新构建newFiber 和 oldFiber比对 -> 形成新的Fiber数组 -> 将Fiber对象应用到真实DOM中

#### 3.4 Fiber 对象

在Fiber对象中，需要额外存储当前节点的父级，当前节点的子级，当前节点的同级；以便在循环Fiber对象的时候，知道节点的对应关系，构建dom。

```
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
```

<img src="./images/3.png"/>


###  4. Fiber的实现

#### 4.1 创建任务队列并添加任务

render方法需要向任务队列中添加任务，先来创建一个任务队列的方法：

```js
// src/react/Misc/CreateTaskQueue/index.js
const createTaskQueue = () => {
  const taskQueue = []
  return {
    /**
     * 向任务队列中添加任务
     */
    push: item => taskQueue.push(item),
    /**
     * 从任务队列中获取任务
     */
    pop: () => taskQueue.shift(),
    /**
     * 判断任务队列中是否还有任务
     */
    isEmpty: () => taskQueue.length === 0
  }
}

export default createTaskQueue
```

改写render方法，为每一个VirtualDom创建fiber对象，往任务队列添加任务，然后指定在浏览器空闲的时间去执行添加的任务：

```js
// src/react/reconciliation/index.js
import { createTaskQueue } from "../Misc"
/**
 * 任务队列
 */
const taskQueue = createTaskQueue()

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
  /**
   * 指定在浏览器空闲的时间去执行添加的任务
   */
  requestIdleCallback(performTask)
}
```

#### 4.2 实现任务的调度逻辑

在浏览器空闲时间执行任务，在空闲的时间一直执行没有执行完的子任务 performTask:

```js
// src/react/reconciliation/index.js

let subTask = null
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

```

执行子任务 workLoop：

```js
// src/react/reconciliation/index.js

const workLoop = deadline => {
  /**
   * 如果子任务不存在 就去获取子任务
   */
  if (!subTask) {
    subTask = getFirstTask()
  }
  /**
   * 如果任务存在并且浏览器有空余时间就调用 executeTask 方法执行任务 
   * executeTask 接受任务 返回新的任务
   */
  while (subTask && deadline.timeRemaining() > 1) {
    // 接受返回新的任务赋给子任务subTask
    subTask = executeTask(subTask)
  }

  if (pendingCommit) {
    // commitAllWork(pendingCommit)
  }
}

```

上面就实现了任务的调度工作。

#### 4.3 构建根节点Fiber对象

实现getFirstTask方法：从任务队列中任务出栈，构建根节点(最外层节点)的fiber对象

```js
// src/react/reconciliation/index.js

const getFirstTask = () => {
  /**
   * 从任务队列中获取任务
   */
  const task = taskQueue.pop()

  /**
   * 构建根节点的fiber对象，并返回
   */
  return {
    props: task.props,
    stateNode: task.dom, // 存储当前节点对应的dom对象
    tag: "host_root", // 节点标记 类型为'host_root'
    effects: [],
    child: null,
    alternate: task.dom.__rootFiberContainer
  }
}
```

#### 4.4 构建子级节点fiber对象

在上面workLoop方法中，subTask = getFirstTask()，此时subTask为根节点构建的fiber对象；把根节点的fiber对象传递给了 executeTask，我们来看看 executeTask 的实现：

executeTask方法参数接收了根节点fiber对象，executeTask中的 reconcileChildren 方法则做了构建子节点fiber对象的事情：

```js
// src/react/reconciliation/index.js

const executeTask = fiber => {
  reconcileChildren(fiber, fiber.props.children)
  console.log(fiber);
}
```

在 reconcileChildren 方法中，构建父节点和子节点的关系，传入fiber 父节点和children 子节点。

在 reconcileChildren 中

* 循环拿到 children 数组中的VirtualDOM，把子级VirtrualDOM转为fiber

* 在循环时，初始渲染构建子级节点 fiber 对象；并且第一个子节点作为父级的子节点，第二个子节点作为第一个子节点的下一个兄弟节点

```js
// src/react/reconciliation/index.js

const reconcileChildren = (fiber, children) => {
  /**
   * children 可能对象 也可能是数组
   * 将children 转换成数组
   */
  const arrifiedChildren = arrified(children)

  // -------------- 循环拿到数组中的VirtualDOM，把子级VirtrualDOM转为fiber --------------
 
  // 循环 arrifiedChildren 使用的索引
  let index = 0
  // arrifiedChildren 数组中元素的个数
  let numberOfElements = arrifiedChildren.length
  // 循环过程中的循环项 就是子节点的 virtualDOM 对象
  let element = null
  // 子级 fiber 对象
  let newFiber = null
  // 上一个兄弟 fiber 对象
  let prevFiber = null
  

  // 循环子级VirtrualDOM
  while (index < numberOfElements) {
    // 子级 virtualDOM 对象
    element = arrifiedChildren[index]
    // console.log(element);
    
    if (element) {
      /**
       * 初始渲染
       */
      // 子级节点 fiber 对象
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

    // 更新
    prevFiber = newFiber
    index++
  }
}
```

#### 4.5 添加stateNode属性（为fiber节点添加真实DOM对象或组件实例对象）

在上面，newFiber.stateNode 为当前节点真实 DOM 对象 或 组件实例对象，stateNode通过createStateNode方法得到的。：

createStateNode 将fiber对象转成真实dom或者组件实例对象:

```js
// src/react/Misc/createStateNode/index.js

import { createDOMElement } from "../../DOM"

const createStateNode = fiber => {
  if (fiber.tag === "host_component") {
    // 普通节点类型生成真实dom
    return createDOMElement(fiber)
  } else {
    // 函数组件或类组件类型这里没有处理
  }
}
export default createStateNode
```

createDOMElement 创建文本节点和元素节点转换为真实dom，<b>createDOMElement方法中不需要再递归遍历子节点创建真实dom了</b>：

```js
// src/react/DOM/createDOMElement.js

import updateNodeElement from "./updateNodeElement"

export default function createDOMElement(virtualDOM) {
  let newElement = null
  if (virtualDOM.type === "text") {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type)
    updateNodeElement(newElement, virtualDOM)
  }

  return newElement
}
```

createReactInstance 将函数组件或类组件类型返回实例：

```js
export const createReactInstance = fiber => {
  let instance = null
  if (fiber.tag === "class_component") {
    instance = new fiber.type(fiber.props)
  } else {
    instance = fiber.type
  }
  return instance
}
```

#### 4.7 构建左侧节点树的子级节点Fiber对象

在 reconcileChildren 中，只构建了根节点的第一层子级节点的fiber对象。

在fiber中，因为第一个子节点作为父级的子节点，第n个子节点作为上一个子节点的下一个兄弟节点的原因，所以fiber先构建完左侧节点树。

executeTask 中，通过 reconcileChildren 方法构建第一层子级fiber对象后，递归 executeTask 构建左侧节点树。

如何实现递归 executeTask 构建左侧节点树呢？

* 判断 fiber.child 存在，也就是第一层子级存在，则将这个子级当做父级，递归构建这个父级下的子级；然后依次递归第n层，直到左侧子节点树fiber对象构建完成。

```js
const executeTask = fiber => {
  /**
   * reconcileChildren 方法构建子级fiber对象
   */
  reconcileChildren(fiber, fiber.props.children)
  
  /**
   * 递归 executeTask 构建左侧节点树：构建第一层子级fiber对象的子级，然后依次递归构建第n层子级fiber对象的子级，直到构建完成左侧节点树
   * 实现：如果fiber.child返回子级，并且将这个子级当做父级，递归构建这个父级下的子级
   */
  if (fiber.child) {
    return fiber.child
  }
}
```

#### 4.8 构建剩余节点的Fiber对象

在构建左侧节点树的子级节点的Fiber对象完成后，需要构建同级及同级子级节点的fiber对象。遍历是从下往上的，而不是像构建左侧节点树时从上往下遍历。

构建左侧节点树的子级节点Fiber对象后，当前fiber对象为最左侧节点树的最后的子级节点，后面的遍历逻辑为：

* 当前fiber如果存在同级，返回同级，构建同级的子级

* 当前fiber如果没有同级，返回到父级，看父级是否有同级

```js
const executeTask = fiber => {

  reconcileChildren(fiber, fiber.props.children)
  
  if (fiber.child) {
    return fiber.child
  }

  let currentExecutelyFiber = fiber
  while (currentExecutelyFiber.parent) {
    // 当前fiber如果存在同级，返回同级，构建同级的子级
    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }
    // 当前fiber如果没有同级，则退到父级，看父级是否有同级
    currentExecutelyFiber = currentExecutelyFiber.parent
  }
}

```

这样就完成了所有节点fiber对象的构建。

#### 4.9 构建effects数组收集fiber对象

将所有的fiber对象存储在最外层节点的effects中：

* 循环时找到每个节点的父级，给每个节点父级effects赋值；父级的effects数组和子级的effects数组进行合并，子级的effects数组和当前的fiber对象合并

```js
const executeTask = fiber => {
  ...
  while (currentExecutelyFiber.parent) {
    currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    )

    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }
    currentExecutelyFiber = currentExecutelyFiber.parent
  }
}
```

#### 4.10 Fiber第二阶段-实现初始渲染

最后，根节点的fiber对象的effects数组中存储了所有子节点fiber对象，而currentExecutelyFiber最后就是根节点的fiber对象，用pendingCommit保存起来：

```js
const executeTask = fiber => {
  ...
  while (currentExecutelyFiber.parent) {
    currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    )

    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }
    currentExecutelyFiber = currentExecutelyFiber.parent
  }

  // 最后dom树构建完成后，currentExecutelyFiber为根节点的fiber对象，用pendingCommit保存起来
  pendingCommit = currentExecutelyFiber
}
```
在执行子任务 workLoop 方法的最后，如果pendingCommit有值了，则调用 commitAllWork 方法进行Fiber第二阶段-实现初始渲染：

```js
const workLoop = deadline => {
  if (!subTask) {
    subTask = getFirstTask()
  }
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
  }

  /**
   * Fiber第二阶段-实现初始渲染
   */
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}
```

commitAllWork 方法实现初始渲染：

* 循环根节点fiber对象的 effets 数组构建 真实DOM 节点树到页面中：（根节点的fiber对象的effects数组中存储了所有子节点fiber对象）

* 构建真实 DOM 节点树只用循环遍历 effets 数组，将子节点的 stateNode 添加到父级的 stateNode中，就可以实现页面的渲染了。

* 这个渲染过程也是用了浏览器的空余时间来执行的，并且stateNode中已经是创建fiber阶段就渲染好了的真实dom，这样极大提高了渲染性能，不会造成页面长任务和卡顿。

```js
const commitAllWork = fiber => {
  fiber.effects.forEach(item => {
    if (item.effectTag === "delete") {
      // 删除
    } else if (item.effectTag === "update") {
      // 更新
    } else if (item.effectTag === "placement") {
      // 向页面中新增节点

      let fiber = item // 当前要追加的子节点
      let parentFiber = item.parent // 当前要追加的子节点的父级

      if (fiber.tag === "host_component") {
        // 如果子节点是普通节点，将子节点追加到父级中
        parentFiber.stateNode.appendChild(fiber.stateNode)
      }
    }
  })
}
```

这样就可以将下面的普通节点渲染到页面中了，运行npm start查看结果。

```js
// src/index.js

import React, { render, Component } from "./react"

const root = document.getElementById("root")

// jsx 会被babel进行转换，转换成React.createElement的调用
const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)
render(jsx, root)
```

#### 4.11 更新节点

在上面的dom中加上更新操作，在2s后调用render方法：

```js
// src/index.js

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)

render(jsx, root)

// 实现更新
setTimeout(() => {
  const jsx = (
    <div>
      <div>奥利给</div>
    </div>
  )
  render(jsx, root)
}, 2000)

```

在上面例子中，因为在2s后又一次调用render方法，又一次创建了fiber对象；在创建节点fiber对象时，要看一下旧的fiber节点，如果旧的fiber节点存在，就说明当前要执行更新操作，需要把旧的fiber节点对象保存起来。

* 渲染后，备份旧的 fiber 节点对象到根节点fiber对象stateNode上，用于stateNode 转成真实dom后，可以取到旧的 fiber 节点对象和新的 fiber 节点对象比对

```js
const commitAllWork = fiber => {
  ....
  // 最后保存根节点fiber对象
  fiber.stateNode.__rootFiberContainer = fiber
}
```

再一次调用render方法时，会重新构建根节点fiber对象，在构建新的根节点fiber对象的 getFirstTask 方法里用 alternate 属性保存旧的根节点fiber对象：

```js
const getFirstTask = () => {
  const task = taskQueue.pop()
  return {
    ...
    alternate: task.dom.__rootFiberContainer, // 旧的根节点fiber对象保存在新节点fiber对象的alternate属性上
  }
}
```

上面 getFirstTask 中：

* 在新的render发生时，构建新的根节点fiber对象，获取旧DOM的根节点fiber对象 __rootFiberContainer 保存在新节点fiber对象的alternate属性上。（旧DOM是stateNode渲染，stateNode保存了__rootFiberContainer，所以旧DOM上有__rootFiberContainer）

<b>reconcileChildren 构建子节点对象时做节点更新，删除，新增标记</b>

reconcileChildren 方法里：

* 如果有当前子节点和当前备份节点alternate 则做更新操作；

* 如果有当前子节点但没有当前备份节点alternate 则作新增操作； 

* 如果没有当前子节点有当前备份节点 alternate 则做删除操作：


```js

const reconcileChildren = (fiber, children) => {
  ...

  let alternate = null // 旧fiber的子节点

  // fiber.alternate 为旧fiber对象，这里获取第一个备份子节点fiber
  if (fiber.alternate && fiber.alternate.child) {
    alternate = fiber.alternate.child
  }

  // 循环子级VirtrualDOM
  while (index < numberOfElements || alternate) {
    // 子级 virtualDOM 对象
    element = arrifiedChildren[index]

    if (!element && alternate) {
      // 没有当前子节点有当前备份节点alternate 则做删除操作
      ...
    } else if (element && alternate) {
      // 有当前子节点和当前备份节点alternate 则做更新操作
      ...
    } else if (element && !alternate) {
      // 初始渲染 和 新增操作
      // 有当前子节点但时没有备份节点alternate 则作新增操作
      ...
    }
    ...

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
```

在上面 reconcileChildren 方法中，需要获取子节点对应的备份节点：

* 首先 alternate = fiber.alternate.child 获取旧根节点fiber对象的第一个备份子节点用于作更新、删除、新增判断；

* 在遍历 VirtrualDOM 时，alternate = alternate.sibling 将 alternate 赋值为下一个兄弟节点，更新备份节点

更新操作：

```js
if (element && alternate) {
  // 有子节点和备份节点 alternate 则做更新操作
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
}
```

删除操作：

```js
if (!element && alternate) {
  // 没有子节点有备份节点 alternate 则做删除操作

  alternate.effectTag = "delete" // effectTag标记为'delete'
  fiber.effects.push(alternate)
}
```

最后需要commit 所有的更新和删除操作

在 commitAllWork 里，遍历effects数组中存储的所有子节点fiber对象，根据当前fiber.effectTag 来判断是执行删除，更新还是新增操作。

```js

const commitAllWork = fiber => {

  fiber.effects.forEach(item => {
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
    // 新增和之前代码一样
    }
  })
}
```

这样就实现了节点的更新了。

#### 总结

回顾一下刚开始说的：

* 如果是 DOM 初始渲染: 通过virtualDOM构建Fiber对象 -> Fiber -> Fiber对象存储在数组 -> 将Fiber对象要执行的操作应用到真实DOM中

* 如果是 DOM 更新操作: 重新构建newFiber 和 oldFiber比对 -> 形成新的Fiber数组 -> 将Fiber对象应用到真实DOM中

来总结一下更详细的过程

如果是 DOM 初始渲染:

* JSX 通过babel 编译成React.createElement的调用后，被转换成了 VirtualDOM；在初始渲染时，会调用render进行渲染，React16 中的render渲染不再是递归遍历递归遍历子节点创建真实dom了。

* render 里会将每一层的 VirtualDOM 创建为fiber 对象，并且创建fiber对象的过程称为子任务（subTask），利用浏览器的空余时间 requestIdleCallback 执行子任务。

* reconcileChildren 方法里会遍历子级 VirtualDOM，构建子级节点 fiber 对象，这个初始渲染的 fiber 对象包含了 { type, props, child, sibling, parent, effects, effectTag, stateNode } 等属性；特别是child属性：第一个子节点作为父级的子节点，第二个子节点作为第一个子节点的下一个兄弟节点。

* reconcileChildren 只会遍历一层VirtualDOM，继续指定 fiber.child 为 子任务，则 递归调用reconcileChildren(fiber.child, fiber.child.props.children)，这样就递归reconcileChildren构建左侧节点树，直到左侧节点树构建 fiber 完成。

* 左侧节点树构建 fiber 完成后，则构建右侧节点树：当前fiber如果存在同级，返回同级，构建同级的子级；当前fiber如果没有同级，返回到父级，看父级是否有同级；直到整个节点树构建 fiber 完成。

* 整个节点树 fiber 构建完成，当前的 fiber 为根节点 fiber，就进入<b>Fiber第二阶段-初始渲染</b>；在commitAllWork(fiber) 初始渲染方法中，fiber.effects 存储了所有子节点fiber对象。

* 遍历fiber.effects，如果子节点是普通节点，遍历将所有子节点追加到对应子节点的父级中，这样就实现了初始渲染了。


如果是 DOM 更新操作

* 备份旧的 fiber 对象，重新构建新的 newFiber

* 重新构建新的 newFiber 需要遍历新的 VirtualDOM；在遍历新的 VirtualDOM 过程中，newFiber 和 oldFiber比对：有当前子节点但没有备份节点则作新增操作，有当前子节点和当前备份节点则做更新操作；没有当前子节点有当前备份节点则做删除操作。

* 新增操作：effectTag标记为'update'；判断新的 newFiber 和 oldFiber：新节点和老节点元素类型相同，不需要重新创建节点，复用旧fiber的stateNode；元素类型不同，不需要进行比对，创建新的真实dom节点/组件实例，用于后面替换老的节点

* 删除操作：effectTag标记为'delete'；把当前旧的 fiber 节点记录下来，后面删除

* commitAllWork(fiber) 新增真实dom：遍历新的fiber.effects，effectTag === "update"则判断当前新的 newFiber 和 oldFiber：节点类型相同，更新内容和属性；节点类型不同，新节点替换旧节点。

* commitAllWork(fiber) 删除dom：遍历新的fiber.effects，effectTag === "delete"则直接 removeChild 旧的真实节点。
