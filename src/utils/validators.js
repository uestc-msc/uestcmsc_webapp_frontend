// 判断字符串是否为邮箱
export function isEmail(str) {
  return /[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$/.test(str);
}

export const inputRules = Object.freeze({
  user: {
    firstNameRules: [v => !!v || '姓名不能为空'],
    usernameRules: [v => isEmail(v) || '邮箱不合法'],
    passwordRules: [v => v.length >= 6 || '密码应不少于 6 位'],
    passwordConfirmRules(that) {
      return [v => v === that.password || '两次输入密码应当相同']
    },
    studentIdRules: [
      v => /\d+/.test(v) || '学号应当为数字',
      v => v.length <= 20 || '学号应不多于 20 位'
    ],
    aboutRules: [v => v.length <= 256 || '应不多于 256 字'],
  },
  activity: {
    titleRules: [
      v => !!v || '标题不能为空',
      v => v.length <= 150 || '标题应不多于 150 字'
    ],
    locationRules: [
      v => !!v || '地点不能为空',
      v => v.length <= 50 || '地点应不多于 50 字'
    ],
    presenterRules: [
      v => v.length !== 0 || '主讲人名单不能为空',
    ],
  }
});