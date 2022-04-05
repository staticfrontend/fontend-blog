/**
 * JS 实现最小堆
 */

class MinHeap {
  constructor() {
    this.heap = [];
  }

  // -------------------------- 插入 ------------------------------
  /**
   * 插入
   * 1.将值插入堆的底部，即数组的尾部
   * 2.然后上移：将这个值和它的父节点交换，直到父节点小于等于这个插入的值
   * 大小为K的堆中插入元素的时间复杂度为O(logK)
   */
  insert(value) {
    this.heap.push(value);
    // 小的上移
    this.shiftUp(this.heap.length - 1);
  }

  /**
   * 获取父节点的节点位置
   * @param {*} index 
   */
  getParentIndex(i) {
    return Math.floor((i - 1) / 2); // 取商
  }
  /**
   * 值小的上移
   * @param index 要移动的节点索引
   */
  shiftUp(index) {
    if (index === 0) {
      // 堆顶
      return;
    }
    const parentIndex = this.getParentIndex(index);

    // 父节点的值大于当前节点值，需要把当前节点上移
    if (this.heap[parentIndex] > this.heap[index]) {
      // 交换当前节点的值和父节点的值
      this.swap(parentIndex, index);

      // 递归上移比较
      this.shiftUp(parentIndex);
    }
  }

  /**
   * 交换值
   */
  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }

  // -------------------------- 删除 ------------------------------
  /**
   * 删除
   * 用数组尾部元素替换堆顶（直接删除堆顶会破坏堆结构）
   * 然后下移：将新堆顶和它的子节点交换，直到子节点大于等于这个新堆顶
   */
  pop() {
    this.heap[0] = this.heap.pop();

    // 下移
    this.shiftDown(0);
  }

  /**
   * 下移
   */
  shiftDown(index) {
    const leftIndex = this.getLeftIndex(index);
    const rightIndex = this.getRightIndex(index);

    if (this.heap[leftIndex] < this.heap[index]) {
      // 左侧子节点的值小于当前节点值，下移
      this.swap(leftIndex, index);
      // 继续递归shiftDown下移
      this.shiftDown(leftIndex);
    }

    // 右侧子节点同理
    if (this.heap[rightIndex] < this.heap[index]) {
      this.swap(rightIndex, index);
      this.shiftDown(rightIndex);
    }
  }
  /**
   * 获取左侧子节点
   */
  getLeftIndex(i) {
    return i * 2 + 1;
  }
  /**
   * 获取右侧子节点
   */
  getRightIndex(i) {
    return i * 2 + 2;
  }

  /**
   * 获取堆顶
   */
  peek() {
    return this.heap[0];
  }
  /**
   * 获取堆的大小
   */
  size() {
    return this.heap.length;
  }
}


// 测试最小堆
const h = new MinHeap();
h.insert(3);
h.insert(2);
h.insert(1);
console.log(h); // [1, 3, 2]

h.pop(); // 移除堆顶
console.log(h); // [2, 3]
