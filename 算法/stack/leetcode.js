/**
 * 题号20
 * 有效的括号
 * 解题步骤：
     遍历字符串，遇到左括号入栈，遇到和栈顶括号类型匹配的右括号就出栈，否则不是有效的
 */

// 对称结构，满足后进先出，使用栈

// 测试用例1：(((())))
// 测试用例2：()()()

// 时间复杂度为O(n)，stack最坏情况下会装下所有的字符串，所以空间复杂度为O(n)
var isValid = function (s) {

  // 优化：如果为奇数，直接为false
  if (s % 2 === 1) { return false; }

  const stack = [];

  for (let i = 0; i < s.length; i ++) {
    const current = s[i];

    // 所有的左括号入栈，遇到右括号左括号出栈
    if (current === '(') {
      stack.push(current);
    } else {
      // 栈顶元素
      const top = stack[stack.length - 1];

      if (top === '(' && current === ')') {
        // 匹配出栈
        stack.pop();
      } else {
        // 否则直接不匹配
        return false;
      }
    }
  }

  // 最后判断栈为空
  return stack.length === 0;
}
