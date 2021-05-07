const { verbose_name, version } = require('/package.json');

export const DEBUG = process.env.NODE_ENV === 'development';
export const baseUrl = DEBUG ? `http://${window.location.hostname}:8000/api` : 'https://api.uestc-msc.com/api';

export const xhrTimeout = 5000;           // xhr 的超时
export const debounceTime = 500;          // 频繁请求被转换为 0.5 秒请求一次
export const displaySuccessTime = 1500;   // 操作成功提示的持续时间
export const displayErrorTime = 3000;     // 操作失败提示的持续时间
export const totalRetryTimes = 5;         // 上传失败的重试次数
export const firstDelay = 1000;           // 上传失败的第一次等待时间（之后采用 * 2 的指数退避策略）

export const iconPath = "/static/icons/favicon-96x96.png";
export const lazyAvatar = "/static/icons/favicon-32x32.png";

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  verbose_name as appName,
  version as appVersion,
}
