/**
 * 题号349：两个数组的交集
 */

var intersection = function(nums1, nums2) {
  return [...new Set(nums1)].filter(v => nums2.includes(v));
}

// 时间复杂度：循环次数为filter和includes两次循环，所以时间复杂度为O(m*n)
// 空间复杂度：最后结果最大为nums1长度，所以空间复杂度为O(n)