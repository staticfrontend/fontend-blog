/**
 * 题号1：两数之和
 */

var twoNum = function (nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const item = nums[i];
    const diff = target - item;
    if (map.has(diff)) { // 新成员差值满足旧成员的值
      return [map.get(diff), i];
    } else {
      map.set(item, i);
    }
  }
}