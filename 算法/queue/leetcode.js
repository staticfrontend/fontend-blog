/**
 * 题号933：最近3000ms内的请求次数
 * 解题步骤：
     有新请求入队，3000ms前发出的请求出队
     队列的长度就是最近请求次数
 */

var RecentCounter = function () {
  // 队列
  this.q = [];
}

RecentCounter.prototype.ping = function (t) {
  // 新请求入队
  this.q.push(t);

  // 循环队头元素，不在[t-3000, t] 的请求出队
  while(this.q[0] < t - 3000) {
    // 出队
    this.q.shift();
  }

  return this.q.length;
}

// 时间复杂度：有while循环，踢出队列最多n个元素，时间复杂度为O(n)
// 空间复杂度：队列最大请求次数为n，空间复杂度为O(n)