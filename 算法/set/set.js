/**
 * 使用 Set 对象：new、add、delete、has、size
 * 迭代 Set：迭代方法、Set 和 Array、求交集/差集
 */

const mySet = new Set();

// 添加
mySet.add(1);
mySet.add(1); // 添加重复只会保存一次
mySet.add('string'); // set添加字符串
mySet.add({ a: 1, b: 2 }); // set添加对象

const has = mySet.has(1);
mySet.delete(1);

// for of 遍历 Set
for (let item of mySet) {
  console.log(item);
}

// keys()
for (let item of mySet.keys()) {
  console.log('keys', item);
}

// values()
for (let item of mySet.values()) {
  console.log('values', item);
}

// entries()
for (let [key, value] of mySet.entries()) {
  // Set 的 key 和 value是一样的
  console.log('entries', key, value);
}

// Set 转为 Array
const arr = [...mySet];
const arr2 = Array.from(mySet);

// Array 转为 Set
const mySetArr = new Set([1, 2, 3, 'string']);

// 交集
const commonArr = [...mySet].filter(v => mySetArr.has(v));
const intersection = new Set(commonArr);

// 差集
const diffArr = [...mySet].filter(v => !mySetArr.has(v));
const diffrence = new Set(diffArr);
