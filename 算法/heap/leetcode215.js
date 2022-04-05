/**
 * 题号215：数组中的第K个最大元素
 * 解题思路：
     看到第K个最大元素考虑使用最小堆
   解题步骤:
     构建一个最小堆，把数组的值插入堆中
     当堆的容量超过K，就删除堆顶
 */

var findKthLargest = function (nums, k) {
  const h = new MinHeap();

  nums.forEach(v => {
    // 将数组的值插入堆中
    h.insert(v);

    // 当堆的容量超过K，删除堆顶
    if (h.size() > k) {
      h.pop();
    }
  });

  // 堆的堆顶就是第K个最大元素
  return h.peek();
}

// 时间复杂度：O(n * logK) => forEach循环循环了n次，里面使用了堆，堆的insert时间复杂度为logK
// 空间复杂度：堆存储了数组元素，堆的大小为K，空间复杂度为O(K)