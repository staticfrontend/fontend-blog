/**
 * 字典Map
 */

const m = new Map();
// 增 set
m.set('a', 1);
m.set('b', 1);

// 删 delete
m.delete('b');
// m.clear(); // 清除所有的键值对

// 改 set
m.set('a', 2);

// 查 get
const a = m.get('a');

