/**
 * 链表
     js 中没有链表，用Object模拟链表
 */

//  定义链表
const a = { val: 'a' };
const b = { val: 'b' };
const c = { val: 'c' };
const d = { val: 'd' };

a.next = b;
b.next = c;
c.next = d;

// 遍历链表
let p = a;
while(p) {
  // 移动指针
  p = p.next;
}

// 链表中插入值，只用改变指针指向
const e = { val: 'e' };
c.next = e;
e.next = d;

// 删除e元素
c.next = d;