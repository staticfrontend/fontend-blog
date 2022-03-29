/**
 * 题号2：两数相加
 * 解题思路：
     遍历链表，从左到右对应位相加，将相加结果的个位放到新链表上，相加结果的十位留到下一次链表的遍历相加
 */

var addTwoNumbers = function(l1, l2) {
  const l3 = new ListNode(0);
  // console.log(l3); // [0]
  let p1 = l1;
  let p2 = l2;
  let p3 = l3;
  let carry = 0; // 相加后的十位数
  // console.log(p1, p2); // [2,4,3], [5,6,4]
  while (p1 || p2) {
    const v1 = p1 ? p1.val : 0;
    const v2 = p2 ? p2.val : 0;
    const sum = v1 + v2 + carry;
    // 取相加后十位数
    carry = Math.floor(sum / 10);

    // 相加个位数加到新链表上
    p3.next = new ListNode(sum % 10);
    // console.log(p3);

    // 继续遍历
    if (p1) p1 = p1.next;
    if (p2) p2 = p2.next;
    
    p3 = p3.next;
  }
  // 链表尾元素相加超过十位数情况
  if (carry) {
    p3.next = new ListNode(carry);
  }
  console.log(l3); // [0,7,0,8]
  return l3.next;
};

// 时间复杂度O(n)
// 空间复杂度O(n)：l3为相加结果，占用空间为n