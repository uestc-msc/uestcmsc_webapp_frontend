// 判断字符串是否为邮箱
export function isEmail(str) {
  return /[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$/
    .test(str);
}
