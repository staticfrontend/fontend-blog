/**
 * 题号3：无重复字符的最长子串
 * 解题思路：
     用双指针来剪切字串，使用右指针(遍历索引)遍历字符串
     遇到重复字符，就把左指针移动到重复字符的下一位
     左指针到右指针的最大距离就是最长字串的长度
 */

var lengthOfLongestSubstring = function (s) {
  let left = 0; // 左指针
  let subLength = 0; // 无重复最长字串长度

  const map = new Map(); // 字符放到字典，用来判断是否有重复字符
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right] >= left)) {
      // 有重复字符，把左指针移动到重复字符的下一位
      left = map.get(s[right] + 1);
    }
    subLength = Math.max(subLength, right - left + 1);
    map.set(s[right], right);
  }
  return subLength;
}

// 时间复杂度：O(n)
// 空间复杂度：O(m)，m为不重复字符得个数