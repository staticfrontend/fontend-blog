/**
 * 集合
 */

// 数组去重
const arr = [1, 1, 2, 2];
const arrUniq = [...new Set(arr)];
console.log(arrUniq);

// 判断元素是否在集合中
const set = new Set(arr);
const has = set.has(1); // 判断1是否在集合中
console.log(has);

// 求交集
const set2 = new Set([2, 3]);
const set3 = [...set].filter(item => set2.has(item)); // set和set2的交集
console.log(set3);
