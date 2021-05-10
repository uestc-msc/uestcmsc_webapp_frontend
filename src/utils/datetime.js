/**
 * 返回小时对应的 Material Design Icon 图标
 * @param hour {Number}
 * @return {string} 图标代号
 */
export function getTimeIcon(hour) {
  const hourEnglish =
    ['twelve', 'one', 'two', 'three',
      'four', 'five', 'six', 'seven',
      'eight', 'nine', 'ten', 'eleven'];
  return `mdi-clock-time-${hourEnglish[hour % 12]}`;
}