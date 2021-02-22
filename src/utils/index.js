const { verbose_name, version } = require('/package.json');
const DEBUG = process.env.NODE_ENV === 'development';
const baseUrl = DEBUG ? 'http://localhost:8000/api' : 'https://uestcmsc-webapp.lyh543.cn/api';
// const baseUrl = 'https://uestcmsc-webapp.lyh543.cn/api';
const debounceTime = 500;

export {
  verbose_name as appName,
  version as appVersion,
  DEBUG,
  baseUrl,
  debounceTime
}