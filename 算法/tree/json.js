/**
 * 前端与树：遍历JSON的所有节点值
 */

const json = {
  a: { b: { c: 1 } },
  d: [1, 2]
};

const dfs = (obj, path) => {
  console.log(obj, path);
  Object.keys(obj).forEach(key => {
    // 递归遍历key
    dfs(obj[key], path.concat(key));
  });
};

dfs(json, []);