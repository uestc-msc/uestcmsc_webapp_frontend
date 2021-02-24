const { verbose_name, version } = require('/package.json');
const DEBUG = process.env.NODE_ENV === 'development';
// const baseUrl = DEBUG ? 'http://localhost:8000/api' : 'https://uestcmsc-webapp.lyh543.cn/api';
// const serverDomain = DEBUG ? 'localhost' : 'uestcmsc-webapp.lyh543.cn'
const debounceTime = 500;

const baseUrl = 'https://uestcmsc-webapp.lyh543.cn/api';
const serverDomain = 'uestcmsc-webapp.lyh543.cn';

export {
  verbose_name as appName,
  version as appVersion,
  DEBUG,
  baseUrl,
  serverDomain,
  debounceTime
}