/**
 * 题号206：反转链表
 * 解题思路：
      p1为原始链表，p2为空链表；
      通过p1.next遍历链表，将头元素重置为下个元素；
      改变头元素的next指针，指向为p2，这样p2就是反转后的结果链表
 */

var reverseList = function(head) {
  // console.log(head) // [1,2,3,4,5]
  let p1 = head;
  let p2 = null;
  // console.log(p1.next.val); // 2
  while (p1) {
    const tmp = p1.next; // [2,3,4,5]
    // console.log(p1);
    p1.next = p2; // 改变头元素p1的指向，指向p2
    // console.log(p1.next);
    p2 = p1; // p2来存储改变next指向的p1
    // console.log(p1);
    p1 = tmp; // 继续执行下次反转    
  }
  return p2;
};

// 时间复杂度为O(n)
// 临时变量是单个值，所以空间复杂度为O(1)

