/**
 * 树：深度优先遍历
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

const dfs = (root) => {
  // 1.访问根节点
  console.log(root.val);
  // 2.对根节点的children依次进行遍历 => 此时就是深度优先遍历
  root.children.forEach(child => dfs(child));
}

dfs(tree);