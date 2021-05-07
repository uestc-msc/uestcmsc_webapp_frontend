export function getTimeIcon(hour) {
  const hourEnglish =
    ['twelve', 'one', 'two', 'three',
      'four', 'five', 'six', 'seven',
      'eight', 'nine', 'ten', 'eleven'];
  return `mdi-clock-time-${hourEnglish[hour % 12]}`;
}