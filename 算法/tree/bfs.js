/**
 * 树：广度优先遍历
 */

const tree = {
  val: 'a',
  children: [
    {
      val: 'b',
      children: [
        {
          val: 'd',
          children: []
        },
        {
          val: 'e',
          children: []
        },
      ]
    },
    {
      val: 'c',
      children: [
        {
          val: 'f',
          children: []
        },
        {
          val: 'g',
          children: []
        },
      ]
    },
  ]
}

const bfs = (root) => {
  // 1.根节点入队
  const queue = [root];
  while (queue.length) { // 4. 执行队列，重复2、3
    // 2.队头出队
    const head = queue.shift();
    console.log(head.val);

    // 3.队头的children依次入队
    head.children.forEach(child => {
      queue.push(child);
    })
  }
}

bfs(tree);